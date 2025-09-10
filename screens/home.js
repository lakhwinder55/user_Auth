import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Alert,
  Dimensions
} from "react-native";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const home = () => {
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const currentUser = auth().currentUser;
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Logout Confirmation",
      "Are you sure you want to logout?",
      [ 
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive", 
          onPress: async () => {
            try {
              await auth().signOut();
              setShowProfile(false);
              navigation.replace("Login");
            } catch (error) {
              console.log("Logout error:", error);
            }
          } 
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      {/* Top bar with profile image */}
      <View style={styles.header}>
        
        <TouchableOpacity onPress={() => setShowProfile(true)}>
          <Image
            source={{ uri: user?.photoURL || "https://i.pravatar.cc/150" }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* Welcome message */}
      <View style={styles.messageContainer}>
        <Text style={styles.welcomeText}>
          Welcome, {user?.displayName || "Guest"}!
        </Text>
      </View>

      {/* Profile Modal - Right Side Drawer */}
      <Modal
        visible={showProfile}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowProfile(false)}
      >
        <View style={styles.drawerOverlay}>
          <TouchableOpacity 
            style={styles.overlayTouchable} 
            onPress={() => setShowProfile(false)}
          />
          <View style={styles.drawerContainer}>
            <Image
              source={{ uri: user?.photoURL || "https://i.pravatar.cc/150" }}
              style={styles.drawerAvatar}
            />
            <Text style={styles.drawerName}>{user?.displayName || "Guest User"}</Text>

            <TouchableOpacity style={styles.simpleButton} onPress={handleLogout}>
              <Text style={styles.simpleButtonText}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.simpleButton} onPress={() => setShowProfile(false)}>
              <Text style={styles.simpleButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Home screen white
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff", // White header
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#8687E7",
  },
  title: {
    fontSize: 20,
    color: "#000", // Black text
    fontWeight: "bold",
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    color: "#000", // Black text
    fontWeight: "bold",
    textAlign: "center",
  },
  drawerOverlay: {
    flex: 1,
    flexDirection: "row-reverse",
    backgroundColor: "rgba(0,0,0,0.2)", // Slightly dark overlay
  },
  overlayTouchable: {
    flex: 1,
  },
  drawerContainer: {
    width: width * 0.5,
    backgroundColor: "#fff", // White drawer
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  drawerAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#8687E7",
    marginBottom: 20,
  },
  drawerName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 30,
  },
  simpleButton: {
    paddingVertical: 8,
    marginBottom: 15,
  },
  simpleButtonText: {
    fontSize: 16,
    color: "#000",
  },
});
