import { API_ENDPOINTS } from "@/constants/api";
import {
    borderRadius,
    colors,
    fontSizes,
    shadows,
    spacing,
} from "@/constants/healthcare-theme";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface Patient {
  _id: string;
  clerk_user_id: string;
  name: string;
  date_of_birth: string;
  gender: string;
  blood_group?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  address?: string;
  allergies: string[];
  chronic_conditions: string[];
  past_surgeries: string[];
  family_history?: string;
  is_active: boolean;
  role: string;
  created_at: string;
  updated_at: string;
}

export default function DoctorDashboard() {
  const { user } = useUser();
  const router = useRouter();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.PATIENTS);

      if (response.ok) {
        const data = await response.json();
        setPatients(data.patients || []);
        setFilteredPatients(data.patients || []);
      } else {
        Alert.alert("Error", "Failed to fetch patients");
      }
    } catch (error) {
      console.error("Fetch patients error:", error);
      Alert.alert("Error", "Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedStatus, selectedBloodGroup, patients]);

  const filterPatients = () => {
    let filtered = [...patients];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.clerk_user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.chronic_conditions &&
            p.chronic_conditions.some((c) =>
              c.toLowerCase().includes(searchQuery.toLowerCase()),
            )),
      );
    }

    // Status filter
    if (selectedStatus === "active") {
      filtered = filtered.filter((p) => p.is_active === true);
    } else if (selectedStatus === "inactive") {
      filtered = filtered.filter((p) => p.is_active === false);
    }

    // Blood group filter
    if (selectedBloodGroup) {
      filtered = filtered.filter((p) => p.blood_group === selectedBloodGroup);
    }

    setFilteredPatients(filtered);
  };

  const renderPatient = ({ item }: { item: Patient }) => (
    <TouchableOpacity
      style={styles.patientCard}
      onPress={() =>
        Alert.alert(
          "Patient Details",
          `${item.name}\nID: ${item.clerk_user_id}`,
        )
      }
    >
      <View style={styles.patientHeader}>
        <View>
          <Text style={styles.patientName}>{item.name}</Text>
          <Text style={styles.patientId}>ID: {item.clerk_user_id}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            item.is_active ? styles.statusActive : styles.statusInactive,
          ]}
        >
          <Text style={styles.statusText}>
            {item.is_active ? "ACTIVE" : "INACTIVE"}
          </Text>
        </View>
      </View>

      <View style={styles.patientInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Gender:</Text>
          <Text style={styles.infoValue}>{item.gender}</Text>
        </View>
        {item.blood_group && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Blood Group:</Text>
            <Text style={styles.infoValue}>{item.blood_group}</Text>
          </View>
        )}
        {item.chronic_conditions && item.chronic_conditions.length > 0 && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Conditions:</Text>
            <Text style={styles.infoValue}>
              {item.chronic_conditions.join(", ")}
            </Text>
          </View>
        )}
        {item.emergency_contact_phone && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Emergency:</Text>
            <Text style={styles.infoValue}>{item.emergency_contact_phone}</Text>
          </View>
        )}
        {item.address && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue}>{item.address}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading patients...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Patients</Text>
        <Text style={styles.headerSubtitle}>
          Dr. {user?.firstName || "Doctor"} {user?.lastName || ""}
        </Text>
      </View>

      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, ID, or condition..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterSection}
      >
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedStatus === "all" && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedStatus("all")}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedStatus === "all" && styles.filterButtonTextActive,
            ]}
          >
            All ({patients.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedStatus === "active" && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedStatus("active")}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedStatus === "active" && styles.filterButtonTextActive,
            ]}
          >
            Active ({patients.filter((p) => p.is_active === true).length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedStatus === "inactive" && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedStatus("inactive")}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedStatus === "inactive" && styles.filterButtonTextActive,
            ]}
          >
            Inactive ({patients.filter((p) => p.is_active === false).length})
          </Text>
        </TouchableOpacity>
        {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((bg) => (
          <TouchableOpacity
            key={bg}
            style={[
              styles.filterButton,
              selectedBloodGroup === bg && styles.filterButtonActive,
            ]}
            onPress={() =>
              setSelectedBloodGroup(selectedBloodGroup === bg ? "" : bg)
            }
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedBloodGroup === bg && styles.filterButtonTextActive,
              ]}
            >
              {bg}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredPatients.length} patient
          {filteredPatients.length !== 1 ? "s" : ""} found
        </Text>
        <TouchableOpacity onPress={() => fetchPatients()}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredPatients}
        keyExtractor={(item) => item._id}
        renderItem={renderPatient}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No patients found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your filters or search query
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/add-patient" as any)}
      >
        <Text style={styles.addButtonText}>+ Add New Patient</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  header: {
    padding: spacing.xl,
    backgroundColor: colors.primary,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.textWhite,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSizes.md,
    color: colors.primaryLight,
  },
  searchSection: {
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  searchInput: {
    backgroundColor: colors.gray50,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  filterSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  filterButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray50,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  filterButtonTextActive: {
    color: colors.textWhite,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  resultsText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  refreshText: {
    fontSize: fontSizes.sm,
    color: colors.primary,
    fontWeight: "600",
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  patientCard: {
    backgroundColor: colors.textWhite,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  patientHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  patientName: {
    fontSize: fontSizes.lg,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  patientId: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusActive: {
    backgroundColor: "#10B981",
  },
  statusInactive: {
    backgroundColor: colors.gray500,
  },
  statusText: {
    fontSize: fontSizes.xs,
    fontWeight: "bold",
    color: colors.textWhite,
  },
  patientInfo: {
    gap: spacing.sm,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoLabel: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: fontSizes.sm,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: fontSizes.lg,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  addButton: {
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.xl,
    left: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: "center",
    ...shadows.lg,
  },
  addButtonText: {
    fontSize: fontSizes.md,
    fontWeight: "bold",
    color: colors.textWhite,
  },
});
