import * as ImagePicker from 'expo-image-picker';
import { Image, Pressable, Text, View } from 'react-native';

type Props = {
    label: string;
    imageUri?: string | null;
    onChange: (image: any) => void;
};

export default function ImagePickerInput({ label, imageUri, onChange }: Props) {

    const pickImage = async () => {
        const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });

        if (!res.canceled) {
            const asset = res.assets[0];

            onChange({
                uri: asset.uri,
                name: 'photo.jpg',
                type: 'image/jpeg',
            });
        }
    };

    return (
        <View className="mb-4">
            <Text className="mb-2">{label}</Text>

            {imageUri ? (
                <Image
                    source={{ uri: imageUri }}
                    className="w-32 h-32 rounded-xl mb-2"
                />
            ) : (
                <View className="w-32 h-32 bg-gray-200 rounded-xl mb-2 justify-center items-center">
                    <Text>No Image</Text>
                </View>
            )}

            <Pressable
                onPress={pickImage}
                className="bg-gray-300 p-3 rounded-xl"
            >
                <Text>Select Image</Text>
            </Pressable>
        </View>
    );
}