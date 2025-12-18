import sys
import requests
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QWidget, QPushButton, QVBoxLayout,
    QLabel, QFileDialog, QTableWidget, QTableWidgetItem,
    QHBoxLayout, QGroupBox, QHeaderView, QMessageBox
)
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QIcon


class UFLApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Optimisation Localisation–Allocation (CFL)")
        self.setGeometry(100, 100, 1100, 650)

        self.usine_file = None
        self.marche_file = None
        self.transport_file = None

        self.apply_theme()
        self.initUI()

    # ================= THEME =================
    def apply_theme(self):
        self.setStyleSheet("""
        QMainWindow {
            background-color: #f4f6f9;
        }

        QLabel {
            font-size: 14px;
        }

        QPushButton {
            background-color: #2563eb;
            color: white;
            padding: 10px;
            border-radius: 8px;
            font-size: 14px;
        }

        QPushButton:hover {
            background-color: #1e40af;
        }

        QPushButton:disabled {
            background-color: #9ca3af;
        }

        QGroupBox {
            background-color: white;
            border-radius: 12px;
            padding: 15px;
            font-weight: bold;
        }

        QTableWidget {
            background-color: white;
            border-radius: 10px;
            gridline-color: #e5e7eb;
        }

        QHeaderView::section {
            background-color: #1f2937;
            color: white;
            padding: 8px;
            border: none;
            font-weight: bold;
        }
        """)

    # ================= UI =================
    def initUI(self):
        main_layout = QVBoxLayout()

        # ---------- TITLE ----------
        title = QLabel("Optimisation de Localisation–Allocation (UFL)")
        title.setAlignment(Qt.AlignCenter)
        title.setStyleSheet("font-size: 22px; font-weight: bold; margin: 15px;")
        main_layout.addWidget(title)

        # ---------- IMPORT CARD ----------
        import_box = QGroupBox("📂 Import des données (Excel)")
        import_layout = QHBoxLayout()

        self.btn_usine = QPushButton("Usines")
        self.btn_usine.clicked.connect(self.load_usines)
        self.btn_usine.setStyleSheet("background-color:#16a34a;")
        import_layout.addWidget(self.btn_usine)

        self.btn_marche = QPushButton("Marchés")
        self.btn_marche.clicked.connect(self.load_marches)
        self.btn_marche.setStyleSheet("background-color:#16a34a;")
        import_layout.addWidget(self.btn_marche)

        self.btn_transport = QPushButton("Transport")
        self.btn_transport.clicked.connect(self.load_transport)
        self.btn_transport.setStyleSheet("background-color:#16a34a;")
        import_layout.addWidget(self.btn_transport)

        import_box.setLayout(import_layout)
        main_layout.addWidget(import_box)

        # ---------- OPTIMIZE ----------
        self.btn_optimize = QPushButton("🚀 Lancer l’optimisation")
        self.btn_optimize.setStyleSheet("""
            background-color:#dc2626;
            font-size:16px;
            font-weight:bold;
            padding:14px;
        """)
        self.btn_optimize.clicked.connect(self.run_optimization)
        main_layout.addWidget(self.btn_optimize)

        # ---------- RESULTS ----------
        result_box = QGroupBox("📊 Résultats")
        result_layout = QVBoxLayout()

        self.result_label = QLabel("Aucun résultat pour le moment.")
        self.result_label.setStyleSheet("font-size:16px; font-weight:bold;")
        result_layout.addWidget(self.result_label)

        self.result_table = QTableWidget()
        self.result_table.setAlternatingRowColors(True)
        self.result_table.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)
        result_layout.addWidget(self.result_table)

        result_box.setLayout(result_layout)
        main_layout.addWidget(result_box)

        container = QWidget()
        container.setLayout(main_layout)
        self.setCentralWidget(container)

    # ================= FILE LOAD =================
    def load_usines(self):
        self.usine_file, _ = QFileDialog.getOpenFileName(
            self, "Choisir Usine.xlsx", "", "Excel Files (*.xlsx)")
        if self.usine_file:
            self.btn_usine.setText("✔ Usines chargées")

    def load_marches(self):
        self.marche_file, _ = QFileDialog.getOpenFileName(
            self, "Choisir Marche.xlsx", "", "Excel Files (*.xlsx)")
        if self.marche_file:
            self.btn_marche.setText("✔ Marchés chargés")

    def load_transport(self):
        self.transport_file, _ = QFileDialog.getOpenFileName(
            self, "Choisir Transport.xlsx", "", "Excel Files (*.xlsx)")
        if self.transport_file:
            self.btn_transport.setText("✔ Transport chargé")

    # ================= API CALL =================
    def run_optimization(self):
        if not all([self.usine_file, self.marche_file, self.transport_file]):
            QMessageBox.warning(self, "Erreur", "Veuillez charger les 3 fichiers Excel.")
            return

        try:
            url = "http://127.0.0.1:5000/optimize"
            with open(self.usine_file, "rb") as uf, \
                 open(self.marche_file, "rb") as mf, \
                 open(self.transport_file, "rb") as tf:

                response = requests.post(url, files={
                    "usines_file": uf,
                    "marches_file": mf,
                    "transport_file": tf
                })

            self.show_results(response.json())

        except Exception as e:
            QMessageBox.critical(self, "Erreur API", str(e))

    # ================= DISPLAY =================
    def show_results(self, data):
        if "error" in data:
            QMessageBox.critical(self, "Erreur", data["error"])
            return

        usines = data["usines_ouvertes"]
        assign = data["assignations"]
        cout = data.get("cout_total", 0)

        self.result_label.setText(
            f"💰 Coût total optimal : {cout} DT | 🏭 Usines ouvertes : {', '.join(usines)}"
        )

        self.result_table.setColumnCount(5)
        self.result_table.setRowCount(len(assign))
        self.result_table.setHorizontalHeaderLabels(
            ["Marché", "Usine", "Demande", "Coût", "Usine ouverte"]
        )

        for row, (marche, info) in enumerate(assign.items()):
            self.result_table.setItem(row, 0, QTableWidgetItem(marche))
            self.result_table.setItem(row, 1, QTableWidgetItem(info["factory"]))
            self.result_table.setItem(row, 2, QTableWidgetItem(str(info["demand"])))
            self.result_table.setItem(row, 3, QTableWidgetItem(str(info["cost"])))
            self.result_table.setItem(
                row, 4,
                QTableWidgetItem("Oui" if info["factory"] in usines else "Non")
            )


# ================= MAIN =================
if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = UFLApp()
    window.show()
    sys.exit(app.exec_())
