import { View, Text, StyleSheet } from 'react-native';
import { Message } from '@/types/council';
import { theme } from '@/constants/theme';
import { AI_MODELS } from '@/constants/config';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';
  const modelConfig = !isUser && AI_MODELS.find(m => m.id === message.sender);

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
      {!isUser && modelConfig && (
        <View style={[styles.modelBadge, { backgroundColor: modelConfig.color }]}>
          <Text style={styles.modelIcon}>{modelConfig.icon}</Text>
        </View>
      )}
      
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.aiBubble,
          !isUser && modelConfig && { borderLeftColor: modelConfig.color },
        ]}
      >
        {!isUser && modelConfig && (
          <Text style={styles.modelName}>{modelConfig.name}</Text>
        )}
        <Text style={[styles.text, isUser && styles.userText]}>{message.text}</Text>
        <Text style={styles.timestamp}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  aiContainer: {
    justifyContent: 'flex-start',
  },
  modelBadge: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  modelIcon: {
    fontSize: 20,
  },
  bubble: {
    maxWidth: '75%',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  userBubble: {
    backgroundColor: theme.colors.primary,
    borderTopRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: theme.colors.surface,
    borderLeftWidth: 4,
    borderTopLeftRadius: 4,
  },
  modelName: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  text: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    lineHeight: 22,
  },
  userText: {
    color: theme.colors.background,
  },
  timestamp: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
    alignSelf: 'flex-end',
  },
});
