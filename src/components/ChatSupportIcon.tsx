import avaChatbot from '../assets/ava_chatbot.jpg';

export function ChatSupportIcon() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden"
        style={{
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08)'
        }}
        aria-label="Chat de soporte"
      >
        <img
          src={avaChatbot}
          alt="Ava chatbot"
          className="w-6 h-6 object-cover"
        />
      </div>
    </div>
  );
}
