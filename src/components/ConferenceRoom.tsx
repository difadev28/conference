import React, { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  Users, 
  Settings,
  MessageCircle,
  Monitor,
  UserCheck
} from 'lucide-react';

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

const ConferenceRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const [api, setApi] = useState<any>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [participantCount, setParticipantCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [waitingForModerator, setWaitingForModerator] = useState(false);

  const userName = searchParams.get('name') || 'Anonymous';
  const isModerator = searchParams.get('moderator') === 'true';

  useEffect(() => {
    if (!roomId) {
      navigate('/');
      return;
    }

    // Load Jitsi Meet External API script
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    script.onload = () => initializeJitsi();
    document.head.appendChild(script);

    return () => {
      if (api) {
        api.dispose();
      }
      document.head.removeChild(script);
    };
  }, [roomId]);

  const initializeJitsi = () => {
    if (jitsiContainerRef.current && window.JitsiMeetExternalAPI) {
      const domain = 'meet.jit.si';
      const options = {
        roomName: roomId,
        width: '100%',
        height: '100%',
        parentNode: jitsiContainerRef.current,
        userInfo: {
          displayName: userName,
          email: isModerator ? 'moderator@videomeet.com' : undefined,
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          enableWelcomePage: false,
          prejoinPageEnabled: !isModerator,
          enableLobbyChat: !isModerator,
          enableInsecureRoomNameWarning: false,
          disableModeratorIndicator: false,
          startScreenSharing: false,
          enableEmailInStats: false,
          toolbarConfig: {
            alwaysVisible: true,
            autoHideWhileChatIsOpen: false,
            timeout: 4000,
          },
          // Enable lobby for non-moderators
          enableLobby: !isModerator,
          // Video layout configuration
          channelLastN: 25,
          startVideoMuted: 0,
          startAudioMuted: 0,
          resolution: 720,
          constraints: {
            video: {
              height: {
                ideal: 720,
                max: 720,
                min: 240
              }
            }
          },
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'embedmeeting',
            'fullscreen', 'fodeviceselection', 'hangup', 'profile', 'chat',
            'recording', 'livestreaming', 'etherpad', 'sharedvideo', 'settings',
            'raisehand', 'videoquality', 'filmstrip', 'invite', 'feedback',
            'stats', 'shortcuts', 'tileview', 'videobackgroundblur', 'download',
            'help', 'mute-everyone', 'security'
          ],
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          BRAND_WATERMARK_LINK: '',
          DEFAULT_BACKGROUND: '#1f2937',
          DISABLE_VIDEO_BACKGROUND: false,
          INITIAL_TOOLBAR_TIMEOUT: 20000,
          TOOLBAR_TIMEOUT: 4000,
          DEFAULT_REMOTE_DISPLAY_NAME: 'Participant',
          SHOW_CHROME_EXTENSION_BANNER: false,
          // Video layout settings
          VIDEO_LAYOUT_FIT: 'both',
          filmStripOnly: false,
          VERTICAL_FILMSTRIP: true,
        },
      };

      const jitsiApi = new window.JitsiMeetExternalAPI(domain, options);
      setApi(jitsiApi);

      // Event listeners
      jitsiApi.addEventListener('videoConferenceJoined', (data: any) => {
        setIsLoading(false);
        setWaitingForModerator(false);
        console.log('Conference joined:', data);
        
        // Set moderator if needed
        if (isModerator) {
          // Grant moderator rights
          jitsiApi.executeCommand('password', '');
        }
      });

      jitsiApi.addEventListener('participantRoleChanged', (data: any) => {
        console.log('Participant role changed:', data);
      });

      jitsiApi.addEventListener('participantJoined', (participant: any) => {
        setParticipantCount(prev => prev + 1);
        console.log('Participant joined:', participant);
      });

      jitsiApi.addEventListener('participantLeft', (participant: any) => {
        setParticipantCount(prev => Math.max(1, prev - 1));
        console.log('Participant left:', participant);
      });

      jitsiApi.addEventListener('participantKickedOut', (data: any) => {
        console.log('Participant kicked out:', data);
        if (data.kicked.local) {
          navigate('/');
        }
      });

      jitsiApi.addEventListener('passwordRequired', () => {
        console.log('Password required');
      });

      jitsiApi.addEventListener('videoConferenceLeft', () => {
        console.log('Conference left');
        navigate('/');
      });

      // Handle lobby events
      jitsiApi.addEventListener('knockingParticipant', (data: any) => {
        console.log('Knocking participant:', data);
        if (isModerator) {
          // Auto-approve for now, you can add manual approval UI later
          setTimeout(() => {
            jitsiApi.executeCommand('answerKnockingParticipant', data.participant.id, true);
          }, 1000);
        }
      });

      jitsiApi.addEventListener('participantMenuButtonClick', (data: any) => {
        console.log('Participant menu clicked:', data);
      });

      jitsiApi.addEventListener('audioMuteStatusChanged', (data: any) => {
        setIsAudioMuted(data.muted);
      });

      jitsiApi.addEventListener('videoMuteStatusChanged', (data: any) => {
        setIsVideoMuted(data.muted);
      });

      // Handle waiting for moderator
      if (!isModerator) {
        setWaitingForModerator(true);
        setTimeout(() => {
          setWaitingForModerator(false);
        }, 3000);
      }
    }
  };

  const toggleAudio = () => {
    if (api) {
      api.executeCommand('toggleAudio');
    }
  };

  const toggleVideo = () => {
    if (api) {
      api.executeCommand('toggleVideo');
    }
  };

  const leaveCall = () => {
    if (api) {
      api.dispose();
    }
    navigate('/');
  };

  const toggleChat = () => {
    if (api) {
      api.executeCommand('toggleChat');
    }
  };

  const toggleScreenShare = () => {
    if (api) {
      api.executeCommand('toggleShareScreen');
    }
  };

  if (!roomId) {
    return null;
  }

  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
      {/* Loading Screen */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h3 className="text-white text-lg font-medium">
              {waitingForModerator ? 'Waiting for moderator approval...' : 'Joining meeting...'}
            </h3>
            <p className="text-gray-400 text-sm">Room: {roomId}</p>
            {isModerator && (
              <p className="text-green-400 text-sm mt-2">✓ Joining as Moderator</p>
            )}
            {waitingForModerator && (
              <p className="text-yellow-400 text-sm mt-2">Please wait for moderator to approve your request</p>
            )}
          </div>
        </div>
      )}

      {/* Logo - Top Left */}
      <div className="absolute top-4 left-4 z-40">
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <Video className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold">VideoMeet</span>
        </div>
      </div>

      {/* Participant Counter - Top Right */}
      <div className="absolute top-4 right-4 z-40">
        <div className="flex items-center gap-4">
          {isModerator && (
            <div className="flex items-center gap-2 bg-green-600/80 backdrop-blur-sm rounded-lg px-3 py-2">
              <UserCheck className="w-4 h-4 text-white" />
              <span className="text-white font-medium text-sm">Moderator</span>
            </div>
          )}
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2">
            <Users className="w-4 h-4 text-white" />
            <span className="text-white font-medium">{participantCount}</span>
          </div>
        </div>
      </div>

      {/* Jitsi Meet Container */}
      <div ref={jitsiContainerRef} className="w-full h-full" />

      {/* Bottom Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-40">
        <div className="flex justify-center pb-6">
          <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-4">
              {/* Audio Toggle */}
              <button
                onClick={toggleAudio}
                className={`p-3 rounded-full transition-all duration-200 ${
                  isAudioMuted 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title={isAudioMuted ? 'Unmute' : 'Mute'}
              >
                {isAudioMuted ? (
                  <MicOff className="w-5 h-5 text-white" />
                ) : (
                  <Mic className="w-5 h-5 text-white" />
                )}
              </button>

              {/* Video Toggle */}
              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full transition-all duration-200 ${
                  isVideoMuted 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title={isVideoMuted ? 'Start Video' : 'Stop Video'}
              >
                {isVideoMuted ? (
                  <VideoOff className="w-5 h-5 text-white" />
                ) : (
                  <Video className="w-5 h-5 text-white" />
                )}
              </button>

              {/* Screen Share */}
              <button
                onClick={toggleScreenShare}
                className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-200"
                title="Share Screen"
              >
                <Monitor className="w-5 h-5 text-white" />
              </button>

              {/* Chat */}
              <button
                onClick={toggleChat}
                className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-200"
                title="Chat"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </button>

              {/* Settings */}
              <button
                className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-200"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-white" />
              </button>

              {/* Leave Call */}
              <button
                onClick={leaveCall}
                className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-all duration-200 ml-2"
                title="Leave Meeting"
              >
                <Phone className="w-5 h-5 text-white transform rotate-[135deg]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Room Info - Bottom Left */}
      <div className="absolute bottom-6 left-4 z-40">
        <div className="bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2">
          <p className="text-white text-sm font-medium">Room: {roomId}</p>
        </div>
      </div>
    </div>
  );
};

export default ConferenceRoom;