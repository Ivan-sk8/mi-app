import { useRouter } from 'expo-router';

import { PlayerView } from '@/components/player-view';

export default function PlayerScreen() {
  const router = useRouter();

  return <PlayerView onClose={() => router.back()} />;
}
