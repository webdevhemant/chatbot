'use server'
// Server actions removed — APPNAME is frontend-only

export async function saveChatModelAsCookie(_model: string) {
  return
}

export async function generateTitleFromUserMessage(_args: { message: unknown }) {
  return 'New Chat'
}

export async function deleteTrailingMessages(_args: { id: string }) {
  return
}

export async function updateChatVisibility(_args: { chatId: string; visibility: string }) {
  return
}
