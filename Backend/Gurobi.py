import gurobipy as gp
from gurobipy import GRB
from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
from flask import request

app = Flask(__name__)
CORS(app)

def optimize_ufl(usines_file="Usine.xlsx", marches_file="Marche.xlsx", transport_file="Transport.xlsx"):

    # === LOAD DATA ===
    factories_df = pd.read_excel(usines_file)
    markets_df = pd.read_excel(marches_file)
    transport_df = pd.read_excel(transport_file)

    factories = list(factories_df['Usine'])
    markets = list(markets_df['Marché'])

    open_cost = dict(zip(factories_df['Usine'], factories_df['Cout_ouverture']))
    demand = dict(zip(markets_df['Marché'], markets_df['Taille_Demande']))
    capacity = dict(zip(factories_df['Usine'], factories_df['Capacité']))
    prod_cost = dict(zip(factories_df['Usine'], factories_df['Cout_production']))

    transport_cost = {
        (row['Usine'], row['Marché']): row['Cout_unitaire']
        for _, row in transport_df.iterrows()
    }

    # === MODEL ===
    m = gp.Model("UFL")

    # VARIABLES
    x = m.addVars(factories, vtype=GRB.BINARY, name="x")
    y = m.addVars(markets, factories, vtype=GRB.BINARY, name="y")

    # OBJECTIVE
    m.setObjective(
    gp.quicksum(demand[i] * (transport_cost[(j, i)] + prod_cost[j]) * y[i, j]
                for i in markets for j in factories)
    + gp.quicksum(open_cost[j] * x[j] for j in factories),
    GRB.MINIMIZE
)


    # CONSTRAINT 1: each market is served by exactly one factory
    for i in markets:
        m.addConstr(gp.quicksum(y[i, j] for j in factories) == 1)

    # CONSTRAINT 2: can't serve a market if factory closed
    for i in markets:
        for j in factories:
            m.addConstr(y[i, j] <= x[j])
    #ConSTRAINT 3: capacity constraints
    for j in factories:
        m.addConstr(gp.quicksum(demand[i] * y[i, j] for i in markets) <= capacity[j] * x[j])

    # === OPTIMIZE ===
    m.optimize()
    # === EXTRACT RESULTS ===
    if m.Status == GRB.OPTIMAL:
        opened_factories = [j for j in factories if x[j].x > 0.5]
        assignations = {}

        for i in markets:
            for j in factories:
                if y[i, j].x > 0.5:
                    assignations[i] = {
                        "factory": j,
                        "demand": demand[i],
                        "cost": demand[i] * (transport_cost[(j, i)] + prod_cost[j])
 
                        }
                    break
        result = {
            "usines_ouvertes": opened_factories,
            "assignations": assignations,
            "cout_total": m.objVal 
            }
    else:
        result = {
        "error": "No feasible solution found",
        "status": m.Status
        }
    return result


@app.route("/optimize", methods=["POST"])
def run_optimization():
    usines_file = request.files.get("usines_file")
    marches_file = request.files.get("marches_file")
    transport_file = request.files.get("transport_file")

    result = optimize_ufl(
        usines_file=usines_file,
        marches_file=marches_file,
        transport_file=transport_file
    )
    return jsonify(result)



if __name__ == "__main__":
    app.run(debug=True)
