import React from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import Typo from "../common/Typo";
import AppIcon from "../common/AppIcon";
import * as Icons from "phosphor-react-native";
import { spacingY, radius, width } from "../../theme/spacing";
import { normalizeY } from "../../utils/normalize";
import colors from "../../theme/colors";

interface CartCardProps {
  item: {
    id: string;
    image: any;
    title: string;
    price: string;
    size: string;
    quantity: number;
  };
  isEdit: boolean;
}

const CartCard: React.FC<CartCardProps> = ({ item, isEdit }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} transition={200} />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.titleContainer}>
          <Typo size={16} style={styles.titleText}>
            {item.title}
          </Typo>
          {isEdit ? (
            <AppIcon
              icon={Icons.X}
              iconWeight="bold"
              iconSize={15}
              iconColor={colors.white}
              containerStyle={styles.deleteIcon}
            />
          ) : (
            <View
              style={[styles.deleteIcon, { backgroundColor: "transparent" }]}
            />
          )}
        </View>
        <Typo size={16} style={styles.priceText}>
          {item.price}
        </Typo>
        <View style={styles.sizeQuantityContainer}>
          <Typo style={styles.sizeText}>{item.size}</Typo>
          <View style={styles.quantityContainer}>
            <AppIcon
              icon={Icons.Minus}
              iconWeight="bold"
              iconSize={15}
              iconColor={colors.white}
              containerStyle={styles.iconButton}
            />
            <Typo style={styles.quantityText}>{item.quantity}</Typo>
            <AppIcon
              icon={Icons.Plus}
              iconWeight="bold"
              iconSize={15}
              iconColor={colors.white}
              containerStyle={styles.iconButton}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartCard;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    gap: spacingY._15,
  },
  imageContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    height: width * 0.3,
    width: width * 0.3,
    borderRadius: radius._20,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "90%",
    height: "90%",
  },
  infoContainer: {
    justifyContent: "space-between",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleText: {
    color: colors.white,
    width: "55%",
    lineHeight: normalizeY(24),
  },
  deleteIcon: {
    backgroundColor: "#e14a4b",
    height: normalizeY(22),
    width: normalizeY(22),
  },
  priceText: {
    color: colors.white,
    fontWeight: "500",
  },
  sizeQuantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sizeText: {
    flex: 1.3,
    color: colors.textGray,
  },
  quantityContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    height: normalizeY(22),
    width: normalizeY(22),
  },
  quantityText: {
    color: colors.white,
  },
});
