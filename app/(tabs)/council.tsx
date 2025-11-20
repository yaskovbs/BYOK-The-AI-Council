import { Screen, CouncilVisualizer } from '@/components';

export default function CouncilScreen() {
  return (
    <Screen edges={['top']}>
      <CouncilVisualizer />
    </Screen>
  );
}
