import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ExponentImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, Modal, Pressable, Text, TextInput, View } from "react-native";

const FIELDS = [
    { label: "Profile Photo", value: "profile_photo" },
    { label: "Couple Picture", value: "couple_pic" },
    { label: "Family Name", value: "family_name" },
    { label: "First Name", value: "first_name" },
    { label: "Middle Name", value: "middle_name" },
    { label: "Last Name", value: "last_name" },
    { label: "Address", value: "address" },
    { label: "Membership Fee", value: "membership_fee" },
    { label: "Occupation", value: "occupation" },
    { label: "Status", value: "status" },
    { label: "Email", value: "email" },
    { label: "Mobile Number", value: "mobile_number" },
];

type Props = {
    visible: boolean;
    onClose: () => void;
    memberId: number;
};

export default function RequestChangeModal({
    visible,
    onClose,
    memberId,
}: Props) {
    const [field, setField] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const [image, setImage] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);

    const pickImage = async () => {
        const res = await ExponentImagePicker.launchImageLibraryAsync({
            mediaTypes: ExponentImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
        });

        if (!res.canceled) {
            setImage(res.assets[0]);
        }
    };

    const submit = async () => {

        if (!field || !message.trim()) return;



        setSubmitting(true);

        try {
            const token = await AsyncStorage.getItem("auth_token");

            const form = new FormData();
            form.append("member_id", String(memberId));
            form.append("chng_field", field);
            form.append("message", message);

            if (image) {
                form.append("image_path", {
                    uri: image.uri,
                    name: "change.jpg",
                    type: "image/jpeg",
                } as any);
            }

            await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/changes/${memberId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: form,
                }
            );

            onClose();
            setField(null);
            setMessage("");
            setImage(null);

        } catch (e) {
            console.log("Change request failed", e);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-[#071633] rounded-t-2xl p-5">
                    <Text className="text-amber-400 text-lg font-bold mb-3">
                        Request Change
                    </Text>

                    {/* Field selector */}
                    <View className="mb-3">
                        {FIELDS.map((f) => (
                            <Pressable
                                key={f.value}
                                onPress={() => setField(f.value)}
                                className={`py-2 px-3 rounded-md mb-1 ${field === f.value
                                    ? "bg-amber-400"
                                    : "bg-[#0f254d]"
                                    }`}
                            >
                                <Text
                                    className={`${field === f.value
                                        ? "text-[#040c1f]"
                                        : "text-slate-300"
                                        }`}
                                >
                                    {f.label}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    {/* Message */}
                    <TextInput
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Explain the change required"
                        placeholderTextColor="#64748b"
                        multiline
                        className="bg-[#0f254d] text-white rounded-lg p-3 mb-3 h-24"
                    />

                    {/* Image */}
                    <Pressable
                        onPress={pickImage}
                        className="border border-dashed border-amber-400 rounded-lg py-3 mb-3"
                    >
                        <Text className="text-center text-amber-400">
                            {image ? "Change Image Selected" : "Upload Image (optional)"}
                        </Text>
                    </Pressable>

                    {image && (
                        <Image
                            source={{ uri: image.uri }}
                            className="w-full h-40 rounded-lg mb-3"
                            resizeMode="cover"
                        />
                    )}

                    {/* Actions */}
                    <View className="flex-row gap-3">
                        <Pressable
                            onPress={onClose}
                            className="flex-1 py-3 rounded-lg bg-slate-600"
                        >
                            <Text className="text-center text-white">Cancel</Text>
                        </Pressable>

                        <Pressable
                            disabled={submitting}
                            onPress={submit}
                            className="flex-1 py-3 rounded-lg bg-amber-500"
                        >
                            <Text className="text-center text-[#040c1f] font-semibold">
                                Submit
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
