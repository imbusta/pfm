import ChatInterface from '../components/ChatInterface';

export default function Chat() {
  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-text-primary mb-6">💬 Finance Copilot</h1>
      <div className="max-w-4xl mx-auto">
        <ChatInterface />
      </div>
    </div>
  );
}
