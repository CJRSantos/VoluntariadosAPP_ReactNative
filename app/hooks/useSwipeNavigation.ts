import { useRouter } from 'expo-router';
import { Directions, Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

interface SwipeNavigationProps {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
}

export const useSwipeNavigation = ({ onSwipeLeft, onSwipeRight }: SwipeNavigationProps) => {
    const router = useRouter();

    const flingLeft = Gesture.Fling()
        .direction(Directions.LEFT)
        .onEnd(() => {
            if (onSwipeLeft) {
                runOnJS(onSwipeLeft)();
            }
        });

    const flingRight = Gesture.Fling()
        .direction(Directions.RIGHT)
        .onEnd(() => {
            if (onSwipeRight) {
                runOnJS(onSwipeRight)();
            }
        });

    const composedGesture = Gesture.Simultaneous(flingLeft, flingRight);

    return { composedGesture };
};
