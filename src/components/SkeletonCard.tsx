import SkeletonPlaceholder from "react-native-skeleton-placeholder";

export default function SkeletonCard() {
  return (
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item
        marginBottom={16}
        borderRadius={18}
        padding={20}
      >
        <SkeletonPlaceholder.Item
          width={120}
          height={24}
          borderRadius={6}
        />

        <SkeletonPlaceholder.Item
          marginTop={18}
          width={180}
          height={18}
          borderRadius={6}
        />

        <SkeletonPlaceholder.Item
          marginTop={14}
          width={90}
          height={36}
          borderRadius={6}
        />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
}