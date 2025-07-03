import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Button } from 'react-native';
// import { useAtom } from 'jotai';
// import { bookmarksAtom, addBookmarkAtom } from '../../store/bookmarkAtoms'; // Example Jotai atom

interface BookmarkItem {
  id: string;
  name: string;
  url: string;
}

const DUMMY_BOOKMARKS: BookmarkItem[] = [
  { id: '1', name: 'Expo Router Docs', url: 'https://docs.expo.dev/router/introduction/' },
  { id: '2', name: 'React Native Styling', url: 'https://reactnative.dev/docs/style' },
  { id: '3', name: 'Jotai State Management', url: 'https://jotai.org/docs/introduction' },
  { id: '4', name: 'Tailwind CSS Official', url: 'https://tailwindcss.com' },
  { id: '5', name: 'Shadcn UI Components', url: 'https://ui.shadcn.com/' },
];

export default function BookmarksScreen() {
  // const [bookmarks, setBookmarks] = useAtom(bookmarksAtom); // Example Jotai usage for actual data
  // const [, addNewBookmark] = useAtom(addBookmarkAtom);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(DUMMY_BOOKMARKS); // Local state for example
  const [newItemName, setNewItemName] = useState('');
  const [newItemUrl, setNewItemUrl] = useState('');


  const handleAddBookmark = () => {
    if (newItemName.trim() && newItemUrl.trim()) {
      const newBookmark: BookmarkItem = {
        id: Math.random().toString(36).substring(7), // Simple unique ID for example
        name: newItemName.trim(),
        url: newItemUrl.trim(),
      };
      setBookmarks(prev => [newBookmark, ...prev]);
      // addNewBookmark({ name: newItemName.trim(), url: newItemUrl.trim() }); // If using Jotai action atom
      setNewItemName('');
      setNewItemUrl('');
    } else {
      alert('Please enter both name and URL.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Bookmark Name"
          value={newItemName}
          onChangeText={setNewItemName}
        />
        <TextInput
          style={styles.input}
          placeholder="Bookmark URL"
          value={newItemUrl}
          onChangeText={setNewItemUrl}
          keyboardType="url"
          autoCapitalize="none"
        />
        <Button title="Add Bookmark" onPress={handleAddBookmark} />
      </View>

      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.itemContainer} onPress={() => alert(`Open: ${item.name} (${item.url})`)}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemUrl} numberOfLines={1} ellipsizeMode="tail">{item.url}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No bookmarks yet. Add some!</Text>}
        contentContainerStyle={{ paddingBottom: 20 }} // Ensure space for last item
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 10, // Removed to allow inputContainer to span width better
    paddingTop: 10,
    backgroundColor: '#fff', // Assuming a white background
  },
  inputContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  title: { // This was removed, but could be added above FlatList if needed
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  itemContainer: {
    backgroundColor: '#fff', // Changed for consistency, or use a slightly different shade
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 15, // Add horizontal margin for items
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0', // Slightly darker border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  itemUrl: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  }
});
