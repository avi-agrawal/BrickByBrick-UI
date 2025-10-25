// Predefined avatar options
export const AVATARS = [
    { id: 'avatar-1', name: 'Professional', emoji: '👨‍💼', color: 'bg-blue-500' },
    { id: 'avatar-2', name: 'Developer', emoji: '👨‍💻', color: 'bg-green-500' },
    { id: 'avatar-3', name: 'Creative', emoji: '👩‍🎨', color: 'bg-purple-500' },
    { id: 'avatar-4', name: 'Student', emoji: '👨‍🎓', color: 'bg-indigo-500' },
    { id: 'avatar-5', name: 'Scientist', emoji: '👩‍🔬', color: 'bg-pink-500' },
    { id: 'avatar-6', name: 'Teacher', emoji: '👩‍🏫', color: 'bg-orange-500' },
    { id: 'avatar-7', name: 'Engineer', emoji: '👨‍🔧', color: 'bg-red-500' },
    { id: 'avatar-8', name: 'Designer', emoji: '👩‍🎨', color: 'bg-teal-500' },
    { id: 'avatar-9', name: 'Writer', emoji: '👨‍💻', color: 'bg-yellow-500' },
    { id: 'avatar-10', name: 'Artist', emoji: '👩‍🎨', color: 'bg-rose-500' },
    { id: 'avatar-11', name: 'Musician', emoji: '👨‍🎵', color: 'bg-violet-500' },
    { id: 'avatar-12', name: 'Athlete', emoji: '👩‍🏃', color: 'bg-emerald-500' },
];

export const getAvatarById = (id: string) => {
    return AVATARS.find(avatar => avatar.id === id) || AVATARS[0];
};

export const getDefaultAvatar = () => AVATARS[0];
