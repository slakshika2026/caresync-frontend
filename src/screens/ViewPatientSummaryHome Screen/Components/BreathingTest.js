import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import api from "../../../Services/AuthService";
import { baseUrl } from "../../../constants/constants";
import { DataTable } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";

function BreathingTest({ PID }) {
  console.log("PID: ", PID);

  const [testResult, setTestResult] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTestData, setSelectedTestData] = useState([]);

  useEffect(() => {
    fetchTestResults();
  }, []);

  const fetchTestResults = async () => {
    try {
      const response = await api.get(`${baseUrl}/breathingTests/${PID}`);
      console.log("Response from backend:", response.data);
      setTestResult(response.data);
    } catch (error) {
      console.log("Error fetching testResults:", error);
    }
  };

  const testResultGraphModal = (data) => {
    if (data.length === 0) {
      Alert.alert(
        "No test results to display",
        "Patient hasn't performed any tests to view the graph"
      );
      return;
    }
    // Sort the data based on date in ascending order
    const sortedData = data
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    // Get the latest five entries
    const latestFiveData = sortedData.slice(0, 5);

    setSelectedTestData(latestFiveData);
    setModalVisible(true);
  };

  // Function to extract month and day from the date
  const extractMonthAndDay = (date) => {
    console.log("Date: ", date);
    const day = date.substring(0, 2);
    const month = date.substring(3, 5);

    // Combine day and month components
    const formattedDate = `${month}/${day}`;
    console.log("Formatted Date: ", formattedDate);

    return formattedDate;
  };

  // Function to map stopwatch time to scale
  const mapStopwatchTimeToScale = (stopwatchTime) => {
    const lastTwoDigits = parseInt(stopwatchTime.slice(-2));
    return lastTwoDigits; // Map it to a scale of 0 to 20
  };

  return (
    <View style={styles.container}>
      <View style={styles.titlecontainer}>
        <Text style={styles.title}>Breathing Test</Text>

        <View style={styles.buttonGraph}>
          <TouchableOpacity onPress={() => testResultGraphModal(testResult)}>
            <Text style={styles.buttonTextGraph}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.tablecontainer}>
        <Text style={styles.headtext}>Past Results</Text>
        <View style={styles.subson}>
          <Text style={styles.text}>Test Date</Text>
          <Text style={styles.text}>Time (H:M:S)</Text>
        </View>
      </View>
      <DataTable>
        {testResult &&
          testResult.map((data, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell
                style={{
                  justifyContent: "center",
                  backgroundColor: "#DEFFFB",
                  marginBottom: 5,
                  paddingRight: 10,
                  borderBottomLeftRadius: 10,
                  borderTopLeftRadius: 10,
                }}
              >
                {data.date}
              </DataTable.Cell>
              <DataTable.Cell
                style={{
                  justifyContent: "center",
                  backgroundColor: "#DEFFFB",
                  marginBottom: 5,
                  borderBottomRightRadius: 10,
                  borderTopRightRadius: 10,
                }}
              >
                {data.stopwatchTime}
              </DataTable.Cell>
            </DataTable.Row>
          ))}
      </DataTable>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Breathing Test Graph</Text>
            <LineChart
              data={{
                labels: selectedTestData
                  .map((data) => extractMonthAndDay(data.date))
                  .reverse(),
                datasets: [
                  {
                    data: selectedTestData
                      .map((data) =>
                        mapStopwatchTimeToScale(data.stopwatchTime)
                      )
                      .reverse(),
                    fill: false,
                  },
                ],
              }}
              width={350}
              height={270}
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#e0f7fa",
                backgroundGradientTo: "#80deea",

                yAxisLabelPosition: "topLeft",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,

                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForVerticalLabels: {
                  fontWeight: "bold",
                },
                propsForHorizontalLabels: {
                  fontWeight: "bold",
                },
                propsForBackgroundLines: {
                  stroke: "",
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "",
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              withShadow={false}
              withInnerLines={false}
              withOuterLines={false}
            />
            <View style={styles.overlay}>
              <Text style={styles.overlayText}>Time (s)</Text>
            </View>
            <View style={styles.overlayDate}>
              <Text style={styles.overlayTextDate}>Month/Day</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  titlecontainer: {
    marginTop: 15,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 20,
  },
  tablecontainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DEFFFB",
    marginTop: 10,
    margin: "4%",
    marginBottom: 10,
    borderRadius: 20,
  },
  headtext: {
    fontSize: 20,
    padding: 10,
    paddingBottom: 10,
    fontWeight: "bold",
  },
  subson: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    margin: 10,
  },
  text: {
    fontSize: 14,
    padding: 10,
    justifyContent: "center",
    fontWeight: "bold",
  },
  rowContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DEFFFB",
    marginTop: 10,
    margin: "10%",
    borderRadius: 20,
  },

  buttonGraph: {
    backgroundColor: "#DEFFFB",
    height: 35,
    width: 100,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
    position: "absolute",
    right: 20,
    top: 10,

    borderWidth: 0.5,
    borderColor: "#00567D",
  },
  buttonTextGraph: {
    fontSize: 18,

    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    width: "90%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#00567D",
    width: 80,
    height: 40,
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  overlay: {
    position: "absolute",
    top: 160,
    left: -5,
  },
  overlayText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    transform: [{ rotate: "-90deg" }],
  },
  overlayTextDate: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
  overlayDate: {
    position: "absolute",
    top: 310,
    left: 150,
  },
});

export default BreathingTest;
