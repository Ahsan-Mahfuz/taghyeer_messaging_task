export const GROUP_PROMPTS = {
  promote: (name: string) => ({
    title: `Make ${name} an admin?`,
    body: "They will be able to add and remove people, promote others, and rename the group. There is no way to undo this from here.",
    confirmLabel: "Make admin",
  }),
  remove: (name: string) => ({
    title: `Remove ${name}?`,
    body: "They stop receiving messages straight away and lose access to the history in this group. An admin can add them back later.",
    confirmLabel: "Remove",
  }),
  leave: () => ({
    title: "Leave this group?",
    body: "You stop receiving messages and the group disappears from your list. Someone still in it will have to add you back.",
    confirmLabel: "Leave group",
  }),
};
