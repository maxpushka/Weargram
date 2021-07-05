export function isAuthorizationReady(state) {
  if (!state) return false;

  return state['@type'] === 'authorizationStateReady';
}

export function orderCompare(order1, order2) {
  let diff = order1.length - order2.length;
  if (diff !== 0) return diff < 0 ? -1 : 1;
  if (order1 === order2) return 0;

  return order1 > order2 ? 1 : -1;
}