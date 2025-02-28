from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime, timedelta
import uuid

app = Flask(__name__)
CORS(app)

contracts = {}
workflows = {}
stages = {}
assignments = {}
users = {"u1": "John", "u2": "Jane", "u3": "Bob"}
groups = {"g1": ["u2", "u3"]}

default_workflow_id = str(uuid.uuid4())
workflows[default_workflow_id] = {"name": "Default Workflow", "stages": []}
stage_ids = {
    "Draft": str(uuid.uuid4()),
    "Review": str(uuid.uuid4()),
    "Approval": str(uuid.uuid4()),
    "Effective": str(uuid.uuid4())
}
stages[stage_ids["Draft"]] = {"name": "Draft", "duration_days": 2, "next_stage_id": stage_ids["Review"], "condition": "complete"}
stages[stage_ids["Review"]] = {"name": "Review", "duration_days": 5, "next_stage_id": stage_ids["Approval"], "condition": "approved"}
stages[stage_ids["Approval"]] = {"name": "Approval", "duration_days": 3, "next_stage_id": stage_ids["Effective"], "condition": "approved"}
stages[stage_ids["Effective"]] = {"name": "Effective", "duration_days": None, "next_stage_id": None, "condition": None}
workflows[default_workflow_id]["stages"] = list(stage_ids.values())

@app.route('/contracts', methods=['POST'])
def create_contract():
    data = request.json
    contract_id = str(uuid.uuid4())
    content = data.get("content", "This is a contract from template.")
    metadata = {
        "title": data.get("title", "New Contract"),
        "parties": data.get("parties", ["Company A", "Vendor X"]),
        "created_by": data.get("user_id", "u1"),
        "version": 1
    }
    contracts[contract_id] = {
        "metadata": metadata,
        "content": content,
        "workflow_id": default_workflow_id,
        "current_stage_id": stage_ids["Draft"],
        "stage_start_time": datetime.now(),
        "versions": [{"version": 1, "content": content, "timestamp": datetime.now()}]
    }
    assignments[contract_id] = {stage_ids["Draft"]: metadata["created_by"]}
    return jsonify({"contract_id": contract_id, "message": "Contract created"}), 201

@app.route('/contracts/<contract_id>', methods=['GET'])
def get_contract(contract_id):
    if contract_id not in contracts:
        return jsonify({"error": "Contract not found"}), 404
    contract = contracts[contract_id]
    current_stage = stages[contract["current_stage_id"]]
    return jsonify({
        "contract_id": contract_id,
        "metadata": contract["metadata"],
        "content": contract["content"],
        "current_stage": current_stage["name"],
        "versions": contract["versions"]
    })

@app.route('/contracts/<contract_id>/edit', methods=['PUT'])
def edit_contract(contract_id):
    if contract_id not in contracts:
        return jsonify({"error": "Contract not found"}), 404
    data = request.json
    contract = contracts[contract_id]
    new_content = data.get("content", contract["content"])
    contract["metadata"]["version"] += 1
    contract["content"] = new_content
    contract["versions"].append({
        "version": contract["metadata"]["version"],
        "content": new_content,
        "timestamp": datetime.now()
    })
    return jsonify({"message": "Contract updated", "version": contract["metadata"]["version"]})

@app.route('/contracts/<contract_id>/stage', methods=['GET'])
def get_current_stage(contract_id):
    if contract_id not in contracts:
        return jsonify({"error": "Contract not found"}), 404
    contract = contracts[contract_id]
    stage = stages[contract["current_stage_id"]]
    assignee = assignments.get(contract_id, {}).get(contract["current_stage_id"], "None")
    return jsonify({
        "contract_id": contract_id,
        "current_stage": stage["name"],
        "assignee": users.get(assignee, assignee),
        "started": contract["stage_start_time"].isoformat(),
        "duration_days": stage["duration_days"]
    })

@app.route('/contracts/<contract_id>/transition', methods=['POST'])
def move_to_next_stage(contract_id):
    if contract_id not in contracts:
        return jsonify({"error": "Contract not found"}), 404
    data = request.json
    contract = contracts[contract_id]
    current_stage = stages[contract["current_stage_id"]]
    next_stage_id = current_stage["next_stage_id"]
    condition_met = data.get("condition_status", False)
    if current_stage["condition"] and not condition_met:
        return jsonify({"error": f"Condition '{current_stage['condition']}' not met"}), 400
    if not next_stage_id:
        return jsonify({"message": "Workflow complete"}), 200
    contract["current_stage_id"] = next_stage_id
    contract["stage_start_time"] = datetime.now()
    if "group_id" in data:
        assignments[contract_id][next_stage_id] = groups[data["group_id"]][0]
    elif "user_id" in data:
        assignments[contract_id][next_stage_id] = data["user_id"]
    return jsonify({"message": f"Moved to {stages[next_stage_id]['name']}"})

@app.route('/contracts/<contract_id>/reassign', methods=['PUT'])
def reassign_task(contract_id):
    if contract_id not in contracts:
        return jsonify({"error": "Contract not found"}), 404
    data = request.json
    new_user_id = data.get("user_id")
    contract = contracts[contract_id]
    current_stage_id = contract["current_stage_id"]
    if new_user_id not in users:
        return jsonify({"error": "User not found"}), 404
    assignments[contract_id][current_stage_id] = new_user_id
    return jsonify({"message": f"Reassigned to {users[new_user_id]}"})

if __name__ == "__main__":
    app.run(debug=True)