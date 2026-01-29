import { Dimensions, FlatList, Image } from "react-native";

const { width } = Dimensions.get("window");
const STORAGE = process.env.EXPO_PUBLIC_STORAGE_URL;

export default function ImageSlider({ images }: { images: string[] }) {
    return (
        <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => String(i)}
            renderItem={({ item }) => (
                <Image
                    source={{ uri: `${STORAGE}/${item}` }}
                    style={{ width, height: 280 }}
                    resizeMode="cover"
                />
            )}
        />
    );
}
