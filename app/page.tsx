import MainContent from "@/components/MainContent";

export default function Home() {
  const maxMessageLength = parseInt(process.env.MAX_MESSAGE_LENGTH || "500", 10);
  return <MainContent maxMessageLength={maxMessageLength} />;
}
