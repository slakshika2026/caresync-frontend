import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";
import Calendar from "./Calendar";
import TestModal from "./Modals/TestModal";
import SymptomModal from "./Modals/SymptomModal";
import PrescriptionModal from "./Modals/PrescriptionModal";
import AppointmentModal from "./Modals/AppointmentModal";

const Inputbar = ({ text1, placeholder, dropdownItems, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleDropdownPress = () => {
    setIsOpen(!isOpen);
  };
  const handleItemPress = (item) => {
    setSelectedItem(item);
    setIsOpen(false);
    onSelect(item); // Call onSelect callback with selected item
  };

  return (
    <View style={styles.inputcontainer}>
      <Text style={styles.text1}>{text1}</Text>
      <TouchableOpacity
        onPress={handleDropdownPress}
        style={styles.dropdownTrigger}
      >
        <Text style={styles.selectedItem}>{selectedItem || placeholder}</Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdownMenu}>
          {dropdownItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleItemPress(item)}
              style={styles.dropdownItem}
            >
              <Text style={styles.itemText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const IncidentTypeDropdown = ({ recordName, description, recordID }) => {
  const dropdownItems = ["TEST", "SYMPTOM", "PRESCRIPTION", "APPOINTMENT"];
  const [selectedOption, setSelectedOption] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedIncidentType, setSelectedIncidentType] = useState("");

  const handleSelect = (item) => {
    setSelectedOption(item);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleNextPress = () => {
    setModalVisible(true);
  };

  const renderModalContent = () => {
    // Render modal content based on selected option
    switch (selectedOption) {
      case "TEST":
        return (
          <TestModal
            recordName={recordName}
            description={description}
            recordID={recordID}
            selectedStartDate={selectedStartDate}
            selectedOption={selectedOption}
            onClose={handleCloseModal}
          />
        );
      case "SYMPTOM":
        return (
          <SymptomModal
            recordName={recordName}
            description={description}
            recordID={recordID}
            selectedStartDate={selectedStartDate}
            selectedOption={selectedOption}
            onClose={handleCloseModal}
          />
        );
      case "PRESCRIPTION":
        return (
          <PrescriptionModal
            recordName={recordName}
            recordID={recordID}
            description={description}
            selectedStartDate={selectedStartDate}
            selectedOption={selectedOption}
            onClose={handleCloseModal}
          />
        );

      case "APPOINTMENT":
        return (
          <AppointmentModal
            recordName={recordName}
            recordID={recordID}
            description={description}
            selectedStartDate={selectedStartDate}
            selectedOption={selectedOption}
            onClose={handleCloseModal}
          />
        );
      default:
        return null;
    }
  };
  // console.log(selectedStartDate);

  const handleCombinedPress = () => {
    handleNextPress(); // Open the modal
    // Save the incident
  };

  const handleDateChange = (date) => {
    setSelectedDate(date); // Update selected date
  };
  // console.log(selectedStartDate)

  return (
    <View style={styles.container}>
      <Inputbar
        text1="Incident Type"
        placeholder="Select Incident type"
        dropdownItems={dropdownItems}
        onSelect={handleSelect}
        selectedIncidentType={selectedIncidentType}
        setSelectedIncidentType={setSelectedIncidentType}
      />
      {/* <Text style={styles.text2}>Incident Date</Text>
      <Calendar
        selectedStartDate={selectedStartDate}
        setSelectedStartDate={setSelectedStartDate}
        onDateChange={handleDateChange}
      /> */}

      <TouchableOpacity style={styles.btn} onPress={handleCombinedPress}>
        <Text style={styles.btntext}>Next</Text>
      </TouchableOpacity>
      <View style={styles.modalContainer}>
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          {renderModalContent()}
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },

  text1: {
    marginLeft: 28,
    fontSize: 10,
    color: "#1e1e1e",
    marginTop: 50,
  },
  text2: {
    marginLeft: 28,
    fontSize: 16,
    color: "#1e1e1e",
    marginTop: 15,
    marginBottom: -40,
  },
  dropdownTrigger: {
    marginLeft: 28,
    marginTop: 10,
    borderColor: "#8e8e8e",
    borderWidth: 1,
    padding: 8,
    width: "88%",
    borderRadius: 10,
  },
  selectedItem: {
    fontSize: 16,
    // fontWeight: "100",
  },
  dropdownMenu: {
    position: "absolute",
    top: 155,
    left: 28,
    backgroundColor: "#f9f9f7",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    marginBottom: 10,
    elevation: 8,
    width: "88%",
    zIndex: 2,
    paddingHorizontal: 12,
  },
  dropdownItem: {
    paddingVertical: 6,
  },
  itemText: {
    fontSize: 16,
    // fontWeight: "bold",
    color: "#1e1e1e",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    backgroundColor: "#00567D",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    width: "90%",
    padding: 2,
    top: '320%',
    alignContent: "center",
    elevation: 4,
    alignSelf: "center",

  },
  btntext: {
    color: "#FFF",
    padding: 8,
    fontSize: 16,
  },
  inputcontainer: {
    // flex: 0.4,
    paddingTop: "15%",
    justifyContent: "center",
  },
  text1: {
    marginLeft: "7%",
    // fontWeight: "500",
    fontSize: 20,
    color: "#1e1e1e",
    // fontFamily: 'poppins regular,',
  },
  input: {
    borderColor: "#8e8e8e",
    borderWidth: 1,
    padding: 10,
    width: "88%",
    height: 38,
    margin: 20,
    marginLeft: "7%",
    // marginTop: 10,
    borderRadius: 10,
    fontSize: 16,
  },
});

export default IncidentTypeDropdown;
