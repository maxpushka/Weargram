import ChatStore from '../Stores/ChatStore';

export function chatListEquals(list1, list2) {
  if (list1 && !list2) return false;
  if (!list1 && list2) return false;
  if (!list1 && !list2) return true;

  if (list1['@type'] !== list2['@type']) return false;

  switch (list1['@type']) {
    case 'chatListMain': {
      return true;
    }
    case 'chatListArchive': {
      return true;
    }
    case 'chatListFilter': {
      return list1.chat_filter_id === list2.chat_filter_id;
    }
  }

  return false;
}

export function positionListEquals(p1, p2) {
  if (p1 && !p2) return false;
  if (!p1 && p2) return false;
  if (!p1 && !p2) return true;

  const {list: list1} = p1;
  const {list: list2} = p2;

  return chatListEquals(list1, list2);
}

export function getChatOrder(chatId, chatList = {'@type': 'chatListMain'}) {
  const position = getChatPosition(chatId, chatList);
  if (!position) return '0';

  return position.order;
}

export function getChatPosition(chatId, chatList = {'@type': 'chatListMain'}) {
  const chat = ChatStore.get(chatId);
  if (!chat) return null;

  const {positions} = chat;
  if (!positions) return null;
  if (!positions.length) return null;

  switch (chatList['@type']) {
    case 'chatListMain': {
      return positions.find(x => x.list['@type'] === 'chatListMain');
    }
    case 'chatListArchive': {
      return positions.find(x => x.list['@type'] === 'chatListArchive');
    }
    case 'chatListFilter': {
      return positions.find(x => x.list['@type'] === 'chatListFilter' && x.list.chat_filter_id ===
          chatList.chat_filter_id);
    }
  }

  return null;
}

export function hasChatList(chatId, chatList = { '@type': 'chatListMain'}) {
  const position = getChatPosition(chatId, chatList);

  return Boolean(position);
}

export function isChatPinned(chatId, chatList = { '@type': 'chatListMain'}) {
  const position = getChatPosition(chatId, chatList);
  if (!position) return false;

  return position.is_pinned;
}
