import sys
import requests
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QWidget, QPushButton, QVBoxLayout,
    QLabel, QFileDialog, QTableWidget, QTableWidgetItem, QHBoxLayout
)
from PyQt5.QtCore import Qt


class UFLApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Optimisation Localisation – Allocation (UFL)")
        self.setGeometry(100, 100, 1000, 600)

        self.usine_file = None
        self.marche_file = None
        self.transport_file = None

        self.initUI()

    def initUI(self):
        layout = QVBoxLayout()

        # === TITRE ===
        title = QLabel("Optimisation UFL – Gurobi + Flask + PyQt5")
        title.setAlignment(Qt.AlignCenter)
        title.setStyleSheet("font-size: 20px; font-weight: bold;")
        layout.addWidget(title)

        # === UPLOAD BUTTONS ===
        upload_layout = QHBoxLayout()

        self.btn_usine = QPushButton("Charger Usine.xlsx")
        self.btn_usine.clicked.connect(self.load_usines)
        upload_layout.addWidget(self.btn_usine)

        self.btn_marche = QPushButton("Charger Marche.xlsx")
        self.btn_marche.clicked.connect(self.load_marches)
        upload_layout.addWidget(self.btn_marche)

        self.btn_transport = QPushButton("Charger Transport.xlsx")
        self.btn_transport.clicked.connect(self.load_transport)
        upload_layout.addWidget(self.btn_transport)

        layout.addLayout(upload_layout)

        # === LAUNCH OPTIMIZATION ===
        self.btn_optimize = QPushButton("Lancer Optimisation")
        self.btn_optimize.clicked.connect(self.run_optimization)
        layout.addWidget(self.btn_optimize)

        # === RESULT TITLE ===
        self.result_label = QLabel("")
        self.result_label.setStyleSheet("font-size: 16px; font-weight: bold; margin-top: 20px;")
        layout.addWidget(self.result_label)

        # === TABLE RESULTS ===
        self.result_table = QTableWidget()
        layout.addWidget(self.result_table)

        container = QWidget()
        container.setLayout(layout)
        self.setCentralWidget(container)

    # ---------- Load files ----------
    def load_usines(self):
        self.usine_file, _ = QFileDialog.getOpenFileName(self, "Choisir Usine.xlsx", "", "Excel Files (*.xlsx)")
        if self.usine_file:
            self.btn_usine.setText(self.usine_file.split("/")[-1])

    def load_marches(self):
        self.marche_file, _ = QFileDialog.getOpenFileName(self, "Choisir Marche.xlsx", "", "Excel Files (*.xlsx)")
        if self.marche_file:
            self.btn_marche.setText(self.marche_file.split("/")[-1])

    def load_transport(self):
        self.transport_file, _ = QFileDialog.getOpenFileName(self, "Choisir Transport.xlsx", "", "Excel Files (*.xlsx)")
        if self.transport_file:
            self.btn_transport.setText(self.transport_file.split("/")[-1])

    # ---------- Call API ----------
    def run_optimization(self):
        if not all([self.usine_file, self.marche_file, self.transport_file]):
            self.result_label.setText("Veuillez charger les 3 fichiers !")
            return

        url = "http://127.0.0.1:5000/optimize"

        try:
            with open(self.usine_file, "rb") as uf, \
                 open(self.marche_file, "rb") as mf, \
                 open(self.transport_file, "rb") as tf:

                files = {
                    "usines_file": uf,
                    "marches_file": mf,
                    "transport_file": tf,
                }
                response = requests.post(url, files=files)
                data = response.json()

            self.show_results(data)

        except Exception as e:
            self.result_label.setText("Erreur API : " + str(e))

    # ---------- Display results ----------
    def show_results(self, data):
        if "error" in data:
            self.result_label.setText("❌ " + data["error"])
            return

        usines_ouvertes = data["usines_ouvertes"]
        assign = data["assignations"]
        cout_total = data.get("cout_total", 0)

        # Affiche le coût total et les usines ouvertes
        self.result_label.setText(
            f"Coût total optimal : {cout_total} DT | Usines ouvertes : {', '.join(usines_ouvertes)}"
        )

        # Prépare la table détaillée
        self.result_table.setColumnCount(5)
        self.result_table.setHorizontalHeaderLabels(
            ["Marché", "Usine", "Demande", "Coût assignation", "Usine ouverte"]
        )
        self.result_table.setRowCount(len(assign))

        for row, (marche, info) in enumerate(assign.items()):
            self.result_table.setItem(row, 0, QTableWidgetItem(marche))
            self.result_table.setItem(row, 1, QTableWidgetItem(info["factory"]))
            self.result_table.setItem(row, 2, QTableWidgetItem(str(info["demand"])))
            self.result_table.setItem(row, 3, QTableWidgetItem(str(info["cost"])))
            is_open = "Oui" if info["factory"] in usines_ouvertes else "Non"
            self.result_table.setItem(row, 4, QTableWidgetItem(is_open))


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = UFLApp()
    window.show()
    sys.exit(app.exec_())
