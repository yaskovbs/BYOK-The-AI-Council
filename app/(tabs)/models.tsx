import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Modal,
} from 'react-native';
import { Screen } from '@/components';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import {
  OPENROUTER_MODELS,
  MODEL_CATEGORIES,
  MODEL_PROVIDERS,
  getModelsByProvider,
  type OpenRouterModel,
} from '@/constants/openrouter-models';
import { aiService } from '@/services/aiService';
import { useAlert } from '@/template';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function ModelsScreen() {
  const { showAlert } = useAlert();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<OpenRouterModel | null>(null);
  const [testPrompt, setTestPrompt] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const filteredModels = useMemo(() => {
    let models = OPENROUTER_MODELS;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      models = models.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.provider.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query) ||
          m.capabilities.some((cap) => cap.toLowerCase().includes(query))
      );
    }

    if (selectedProvider) {
      models = models.filter((m) => m.provider === selectedProvider);
    }

    if (selectedCategory) {
      models = models.filter((m) => m.category === selectedCategory);
    }

    return models;
  }, [searchQuery, selectedProvider, selectedCategory]);

  const handleTestModel = async () => {
    if (!selectedModel || !testPrompt.trim()) {
      showAlert('Please enter a test prompt');
      return;
    }

    setIsTesting(true);
    const result = await aiService.callOpenRouter(testPrompt, selectedModel.id);
    setIsTesting(false);

    if (result.error) {
      showAlert(`Error: ${result.error}`);
    } else {
      showAlert(`Response: ${result.text.substring(0, 200)}...`);
    }
    setIsModalVisible(false);
    setTestPrompt('');
  };

  const renderModelCard = ({ item }: { item: OpenRouterModel }) => (
    <Animated.View entering={FadeIn}>
      <Pressable
        style={({ pressed }) => [
          styles.modelCard,
          pressed && styles.modelCardPressed,
        ]}
        onPress={() => {
          setSelectedModel(item);
          setIsModalVisible(true);
        }}
      >
        <View style={styles.modelHeader}>
          <View style={styles.modelTitleRow}>
            <Text style={styles.modelName}>{item.name}</Text>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </View>
          <Text style={styles.modelProvider}>{item.provider}</Text>
        </View>

        <Text style={styles.modelDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.modelCapabilities}>
          {item.capabilities.slice(0, 3).map((cap) => (
            <View key={cap} style={styles.capabilityTag}>
              <Text style={styles.capabilityText}>{cap}</Text>
            </View>
          ))}
          {item.capabilities.length > 3 && (
            <Text style={styles.moreCapabilities}>
              +{item.capabilities.length - 3} more
            </Text>
          )}
        </View>

        <View style={styles.modelFooter}>
          <View style={styles.contextInfo}>
            <MaterialCommunityIcons name="file-document-outline" size={14} color={theme.colors.textMuted} />
            <Text style={styles.contextText}>
              {(item.contextWindow / 1000).toFixed(0)}K context
            </Text>
          </View>
          <View style={styles.pricingInfo}>
            <Text style={styles.pricingText}>
              ${item.pricing.input}/${item.pricing.output} per M
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🤖 AI Models</Text>
          <Text style={styles.subtitle}>
            {filteredModels.length} of {OPENROUTER_MODELS.length} models
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search models..."
            placeholderTextColor={theme.colors.textMuted}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery('')}>
              <MaterialCommunityIcons name="close-circle" size={20} color={theme.colors.textSecondary} />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.filtersContainer}>
          <FlatList
            horizontal
            data={['All', ...MODEL_PROVIDERS]}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                style={[
                  styles.filterChip,
                  (item === 'All' ? !selectedProvider : selectedProvider === item) &&
                    styles.filterChipActive,
                ]}
                onPress={() => setSelectedProvider(item === 'All' ? null : item)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    (item === 'All' ? !selectedProvider : selectedProvider === item) &&
                      styles.filterChipTextActive,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            )}
          />
        </View>

        <FlatList
          data={filteredModels}
          keyExtractor={(item) => item.id}
          renderItem={renderModelCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedModel && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{selectedModel.name}</Text>
                    <Pressable onPress={() => setIsModalVisible(false)}>
                      <MaterialCommunityIcons name="close" size={24} color={theme.colors.text} />
                    </Pressable>
                  </View>

                  <Text style={styles.modalProvider}>{selectedModel.provider}</Text>
                  <Text style={styles.modalDescription}>{selectedModel.description}</Text>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Capabilities</Text>
                    <View style={styles.modalCapabilities}>
                      {selectedModel.capabilities.map((cap) => (
                        <View key={cap} style={styles.capabilityTag}>
                          <Text style={styles.capabilityText}>{cap}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Specifications</Text>
                    <Text style={styles.modalSpec}>
                      Context: {(selectedModel.contextWindow / 1000).toFixed(0)}K tokens
                    </Text>
                    <Text style={styles.modalSpec}>
                      Input: ${selectedModel.pricing.input}/M tokens
                    </Text>
                    <Text style={styles.modalSpec}>
                      Output: ${selectedModel.pricing.output}/M tokens
                    </Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Test Model</Text>
                    <TextInput
                      style={styles.testInput}
                      value={testPrompt}
                      onChangeText={setTestPrompt}
                      placeholder="Enter a test prompt..."
                      placeholderTextColor={theme.colors.textMuted}
                      multiline
                    />
                  </View>

                  <Pressable
                    style={[styles.testButton, isTesting && styles.testButtonDisabled]}
                    onPress={handleTestModel}
                    disabled={isTesting}
                  >
                    <Text style={styles.testButtonText}>
                      {isTesting ? 'Testing...' : 'Test Model'}
                    </Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </Screen>
  );
}

function getCategoryColor(category: string): string {
  switch (category) {
    case 'flagship':
      return '#FFD700';
    case 'advanced':
      return '#4285f4';
    case 'fast':
      return '#00D9FF';
    case 'mini':
      return '#10a37f';
    case 'specialized':
      return '#8B5CF6';
    default:
      return theme.colors.primary;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  filtersContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  filterChip: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeight.medium,
  },
  filterChipTextActive: {
    color: theme.colors.text,
  },
  listContent: {
    padding: theme.spacing.lg,
  },
  modelCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.md,
  },
  modelCardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.8,
  },
  modelHeader: {
    marginBottom: theme.spacing.sm,
  },
  modelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  modelName: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginLeft: theme.spacing.sm,
  },
  categoryText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    textTransform: 'uppercase',
  },
  modelProvider: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  modelDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },
  modelCapabilities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.sm,
  },
  capabilityTag: {
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  capabilityText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
  },
  moreCapabilities: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primary,
    alignSelf: 'center',
  },
  modelFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  contextInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contextText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginLeft: theme.spacing.xs,
  },
  pricingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pricingText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  modalTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    flex: 1,
  },
  modalProvider: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  modalDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  modalSection: {
    marginBottom: theme.spacing.lg,
  },
  modalSectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  modalCapabilities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  modalSpec: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  testInput: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  testButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  testButtonDisabled: {
    opacity: 0.5,
  },
  testButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
});
