import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen, MessageBubble } from '@/components';
import { useCouncil } from '@/hooks/useCouncil';
import { theme } from '@/constants/theme';

export default function ChatScreen() {
  const { messages, sendMessage, isThinking, activeModel } = useCouncil();
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim() && !isThinking) {
      const message = input.trim();
      setInput('');
      await sendMessage(message);
    }
  };

  return (
    <Screen edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🐝 AI Council Chat</Text>
          {activeModel && (
            <Text style={styles.headerSubtitle}>
              {activeModel.toUpperCase()} is thinking...
            </Text>
          )}
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.messagesList}
          inverted={false}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask the Council anything..."
            placeholderTextColor={theme.colors.textMuted}
            multiline
            maxLength={500}
            editable={!isThinking}
          />
          <Pressable
            style={[styles.sendButton, (!input.trim() || isThinking) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!input.trim() || isThinking}
          >
            <MaterialCommunityIcons
              name="send"
              size={24}
              color={!input.trim() || isThinking ? theme.colors.textMuted : theme.colors.background}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
  },
  messagesList: {
    paddingVertical: theme.spacing.md,
    flexGrow: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    maxHeight: 100,
    marginRight: theme.spacing.sm,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.surfaceLight,
  },
});
