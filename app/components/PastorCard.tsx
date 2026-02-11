import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function PastorCard({ item }: { item: any }) {

    const router = useRouter();



    return (

        <TouchableOpacity
            onPress={() => router.push(`/pastor/${item.id}`)}

        >

            <View className="flex  flex-row gap-10  bg-[#053575] rounded-xl p-4 mb-3 shadow-sm">


                <View>
                    {item.photo &&
                        <Image
                            source={
                                item?.photo
                                    ? { uri: `${process.env.EXPO_PUBLIC_STORAGE_URL}/${item.photo}` }
                                    : require("../../assets/images/avatar.png")
                            }
                            className="w-20 h-20 rounded-full"
                            resizeMode="contain"

                        />
                    }

                </View>

                <View className="flex flex-col space-y-2">
                    <Text className="text-sm text-[#defaec]">{item.name}</Text>
                    <Text className="text-sm text-[#defaec]">{item.designation}</Text>
                    <Text className="text-sm text-[#defaec]">{item.date_of_joining}</Text>

                </View>




            </View>
        </TouchableOpacity>
    );
}
