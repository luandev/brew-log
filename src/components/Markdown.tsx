import { Text } from "react-native";

export function Markdown({ source }: { source?: string | null }) {
  if (!source || !source.trim()) return null;
  return <Text>{source}</Text>;
}
