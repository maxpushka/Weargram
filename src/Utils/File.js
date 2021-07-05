import ChatStore from '../Stores/ChatStore';
import FileStore from '../Stores/FileStore';

export function loadChatsContent(store, ids) {
  if (!ids) return;

  ids.forEach(id => loadChatContent(store, id));
}

export function loadChatContent(store, chatId, full = false) {
  const chat = ChatStore.get(chatId);
  if (!chat) return;

  const { photo } = chat;
  loadChatPhotoContent(store, photo, chat.id, full);
}

export function loadChatPhotoContent(store, photo, chatId, full) {
  if (!photo) return;

  const { small, big } = photo;

  loadChatFileContent(store, small, chatId);
  if (full) loadChatFileContent(store, big, chatId);
}

function loadChatFileContent(store, file, chatId) {
  if (!file) return;

  const { id } = file;
  file = FileStore.get(id) || file;

  const chat = ChatStore.get(chatId);
  if (!chat) return;

  const dataUrl = FileStore.getDataUrl(id);
  if (dataUrl) return;

  const blob = file.blob || FileStore.getBlob(id);
  if (blob) return;

  FileStore.getLocalFile(
      store,
      file,
      null,
      () => FileStore.updateChatPhotoBlob(chatId, id),
      () => FileStore.getRemoteFile(id, THUMBNAIL_PRIORITY, chat)
  );
}