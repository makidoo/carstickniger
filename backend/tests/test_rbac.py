"""
RBAC (Role-Based Access Control) Tests for Niger Digital Vehicle Sticker System
Tests role hierarchy: Super Admin > Admin > Supervisor > Agent
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestAdminAuthentication:
    """Test admin login for all roles"""
    
    def test_super_admin_login(self):
        """Super Admin should login successfully"""
        response = requests.post(f"{BASE_URL}/api/auth/admin/login", json={
            "username": "superadmin",
            "password": "superadmin123"
        })
        assert response.status_code == 200, f"Super Admin login failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        assert data["user"]["role"] == "super_admin"
        print(f"✓ Super Admin login successful - role: {data['user']['role']}")
    
    def test_admin_login(self):
        """Admin should login successfully"""
        response = requests.post(f"{BASE_URL}/api/auth/admin/login", json={
            "username": "admin",
            "password": "admin123"
        })
        assert response.status_code == 200, f"Admin login failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        assert data["user"]["role"] == "admin"
        print(f"✓ Admin login successful - role: {data['user']['role']}")
    
    def test_supervisor_niamey_login(self):
        """Supervisor Niamey should login successfully with region"""
        response = requests.post(f"{BASE_URL}/api/auth/admin/login", json={
            "username": "sup_niamey",
            "password": "supervisor123"
        })
        assert response.status_code == 200, f"Supervisor login failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        assert data["user"]["role"] == "supervisor"
        assert data["user"]["region"] == "Niamey", f"Expected region Niamey, got {data['user'].get('region')}"
        print(f"✓ Supervisor Niamey login successful - role: {data['user']['role']}, region: {data['user']['region']}")
    
    def test_supervisor_maradi_login(self):
        """Supervisor Maradi should login successfully with region"""
        response = requests.post(f"{BASE_URL}/api/auth/admin/login", json={
            "username": "sup_maradi",
            "password": "supervisor123"
        })
        assert response.status_code == 200, f"Supervisor login failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        assert data["user"]["role"] == "supervisor"
        assert data["user"]["region"] == "Maradi", f"Expected region Maradi, got {data['user'].get('region')}"
        print(f"✓ Supervisor Maradi login successful - role: {data['user']['role']}, region: {data['user']['region']}")
    
    def test_agent_niamey_login(self):
        """Agent Niamey should login successfully with region"""
        response = requests.post(f"{BASE_URL}/api/auth/admin/login", json={
            "username": "agent_niamey",
            "password": "agent123"
        })
        assert response.status_code == 200, f"Agent login failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        assert data["user"]["role"] == "agent"
        assert data["user"]["region"] == "Niamey", f"Expected region Niamey, got {data['user'].get('region')}"
        print(f"✓ Agent Niamey login successful - role: {data['user']['role']}, region: {data['user']['region']}")
    
    def test_invalid_credentials(self):
        """Invalid credentials should return 401"""
        response = requests.post(f"{BASE_URL}/api/auth/admin/login", json={
            "username": "invalid",
            "password": "invalid"
        })
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ Invalid credentials correctly rejected")


class TestSuperAdminAccess:
    """Test Super Admin has access to ALL endpoints"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        response = requests.post(f"{BASE_URL}/api/auth/admin/login", json={
            "username": "superadmin",
            "password": "superadmin123"
        })
        self.token = response.json()["access_token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_super_admin_dashboard_access(self):
        """Super Admin should access dashboard"""
        response = requests.get(f"{BASE_URL}/api/admin/dashboard", headers=self.headers)
        assert response.status_code == 200, f"Dashboard access failed: {response.text}"
        data = response.json()
        assert "total_vehicles" in data
        print(f"✓ Super Admin can access dashboard - {data.get('total_vehicles')} vehicles")
    
    def test_super_admin_vehicles_access(self):
        """Super Admin should access all vehicles"""
        response = requests.get(f"{BASE_URL}/api/admin/vehicles", headers=self.headers)
        assert response.status_code == 200, f"Vehicles access failed: {response.text}"
        print(f"✓ Super Admin can access vehicles - {len(response.json())} vehicles")
    
    def test_super_admin_stickers_access(self):
        """Super Admin should access all stickers"""
        response = requests.get(f"{BASE_URL}/api/admin/stickers", headers=self.headers)
        assert response.status_code == 200, f"Stickers access failed: {response.text}"
        print(f"✓ Super Admin can access stickers - {len(response.json())} stickers")
    
    def test_super_admin_tax_config_access(self):
        """Super Admin should access tax configs"""
        response = requests.get(f"{BASE_URL}/api/admin/tax-configs", headers=self.headers)
        assert response.status_code == 200, f"Tax config access failed: {response.text}"
        print(f"✓ Super Admin can access tax configs - {len(response.json())} configs")
    
    def test_super_admin_users_access(self):
        """Super Admin should access user management"""
        response = requests.get(f"{BASE_URL}/api/admin/users", headers=self.headers)
        assert response.status_code == 200, f"Users access failed: {response.text}"
        print(f"✓ Super Admin can access users - {len(response.json())} users")
    
    def test_super_admin_reports_access(self):
        """Super Admin should access reports"""
        response = requests.get(f"{BASE_URL}/api/admin/reports/payments", headers=self.headers)
        assert response.status_code == 200, f"Reports access failed: {response.text}"
        print(f"✓ Super Admin can access reports")
    
    def test_super_admin_audit_logs_access(self):
        """Super Admin should access audit logs"""
        response = requests.get(f"{BASE_URL}/api/admin/audit-logs", headers=self.headers)
        assert response.status_code == 200, f"Audit logs access failed: {response.text}"
        print(f"✓ Super Admin can access audit logs - {len(response.json())} logs")


class TestAdminAccess:
    """Test Admin has access to all except audit logs"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        response = requests.post(f"{BASE_URL}/api/auth/admin/login", json={
            "username": "admin",
            "password": "admin123"
        })
        self.token = response.json()["access_token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_admin_dashboard_access(self):
        """Admin should access dashboard"""
        response = requests.get(f"{BASE_URL}/api/admin/dashboard", headers=self.headers)
        assert response.status_code == 200, f"Dashboard access failed: {response.text}"
        print(f"✓ Admin can access dashboard")
    
    def test_admin_vehicles_access(self):
        """Admin should access all vehicles"""
        response = requests.get(f"{BASE_URL}/api/admin/vehicles", headers=self.headers)
        assert response.status_code == 200, f"Vehicles access failed: {response.text}"
        print(f"✓ Admin can access vehicles")
    
    def test_admin_stickers_access(self):
        """Admin should access all stickers"""
        response = requests.get(f"{BASE_URL}/api/admin/stickers", headers=self.headers)
        assert response.status_code == 200, f"Stickers access failed: {response.text}"
        print(f"✓ Admin can access stickers")
    
    def test_admin_tax_config_access(self):
        """Admin should access tax configs (read only)"""
        response = requests.get(f"{BASE_URL}/api/admin/tax-configs", headers=self.headers)
        assert response.status_code == 200, f"Tax config access failed: {response.text}"
        print(f"✓ Admin can access tax configs (read)")
    
    def test_admin_users_access(self):
        """Admin should access user management (supervisors and agents only)"""
        response = requests.get(f"{BASE_URL}/api/admin/users", headers=self.headers)
        assert response.status_code == 200, f"Users access failed: {response.text}"
        users = response.json()
        # Admin should only see supervisors and agents, not super_admin or admin
        for user in users:
            assert user["role"] in ["supervisor", "agent"], f"Admin should not see {user['role']} users"
        print(f"✓ Admin can access users (supervisors/agents only) - {len(users)} users")
    
    def test_admin_reports_access(self):
        """Admin should access reports"""
        response = requests.get(f"{BASE_URL}/api/admin/reports/payments", headers=self.headers)
        assert response.status_code == 200, f"Reports access failed: {response.text}"
        print(f"✓ Admin can access reports")
    
    def test_admin_audit_logs_denied(self):
        """Admin should NOT access audit logs"""
        response = requests.get(f"{BASE_URL}/api/admin/audit-logs", headers=self.headers)
        assert response.status_code == 403, f"Expected 403 for audit logs, got {response.status_code}"
        print(f"✓ Admin correctly denied access to audit logs")


class TestSupervisorAccess:
    """Test Supervisor has limited access and region filtering"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        response = requests.post(f"{BASE_URL}/api/auth/admin/login", json={
            "username": "sup_niamey",
            "password": "supervisor123"
        })
        self.token = response.json()["access_token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_supervisor_dashboard_access(self):
        """Supervisor should access dashboard with region filter"""
        response = requests.get(f"{BASE_URL}/api/admin/dashboard", headers=self.headers)
        assert response.status_code == 200, f"Dashboard access failed: {response.text}"
        data = response.json()
        # Supervisor should see their region in response
        assert data.get("region") == "Niamey", f"Expected region Niamey, got {data.get('region')}"
        print(f"✓ Supervisor can access dashboard - region: {data.get('region')}")
    
    def test_supervisor_vehicles_access(self):
        """Supervisor should access vehicles (region filtered)"""
        response = requests.get(f"{BASE_URL}/api/admin/vehicles", headers=self.headers)
        assert response.status_code == 200, f"Vehicles access failed: {response.text}"
        print(f"✓ Supervisor can access vehicles")
    
    def test_supervisor_stickers_access(self):
        """Supervisor should access stickers (region filtered)"""
        response = requests.get(f"{BASE_URL}/api/admin/stickers", headers=self.headers)
        assert response.status_code == 200, f"Stickers access failed: {response.text}"
        print(f"✓ Supervisor can access stickers")
    
    def test_supervisor_tax_config_denied(self):
        """Supervisor should NOT access tax configs"""
        response = requests.get(f"{BASE_URL}/api/admin/tax-configs", headers=self.headers)
        assert response.status_code == 403, f"Expected 403 for tax configs, got {response.status_code}"
        print(f"✓ Supervisor correctly denied access to tax configs")
    
    def test_supervisor_users_denied(self):
        """Supervisor should NOT access user management"""
        response = requests.get(f"{BASE_URL}/api/admin/users", headers=self.headers)
        assert response.status_code == 403, f"Expected 403 for users, got {response.status_code}"
        print(f"✓ Supervisor correctly denied access to user management")
    
    def test_supervisor_reports_access(self):
        """Supervisor should access reports (region filtered)"""
        response = requests.get(f"{BASE_URL}/api/admin/reports/payments", headers=self.headers)
        assert response.status_code == 200, f"Reports access failed: {response.text}"
        data = response.json()
        assert data.get("region") == "Niamey", f"Expected region Niamey, got {data.get('region')}"
        print(f"✓ Supervisor can access reports - region: {data.get('region')}")
    
    def test_supervisor_audit_logs_denied(self):
        """Supervisor should NOT access audit logs"""
        response = requests.get(f"{BASE_URL}/api/admin/audit-logs", headers=self.headers)
        assert response.status_code == 403, f"Expected 403 for audit logs, got {response.status_code}"
        print(f"✓ Supervisor correctly denied access to audit logs")


class TestAgentAccess:
    """Test Agent has minimal access (scanner only)"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        response = requests.post(f"{BASE_URL}/api/auth/admin/login", json={
            "username": "agent_niamey",
            "password": "agent123"
        })
        self.token = response.json()["access_token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_agent_dashboard_denied(self):
        """Agent should NOT access dashboard"""
        response = requests.get(f"{BASE_URL}/api/admin/dashboard", headers=self.headers)
        assert response.status_code == 403, f"Expected 403 for dashboard, got {response.status_code}"
        print(f"✓ Agent correctly denied access to dashboard")
    
    def test_agent_vehicles_denied(self):
        """Agent should NOT access admin vehicles"""
        response = requests.get(f"{BASE_URL}/api/admin/vehicles", headers=self.headers)
        assert response.status_code == 403, f"Expected 403 for vehicles, got {response.status_code}"
        print(f"✓ Agent correctly denied access to admin vehicles")
    
    def test_agent_stickers_denied(self):
        """Agent should NOT access admin stickers"""
        response = requests.get(f"{BASE_URL}/api/admin/stickers", headers=self.headers)
        assert response.status_code == 403, f"Expected 403 for stickers, got {response.status_code}"
        print(f"✓ Agent correctly denied access to admin stickers")
    
    def test_agent_tax_config_denied(self):
        """Agent should NOT access tax configs"""
        response = requests.get(f"{BASE_URL}/api/admin/tax-configs", headers=self.headers)
        assert response.status_code == 403, f"Expected 403 for tax configs, got {response.status_code}"
        print(f"✓ Agent correctly denied access to tax configs")
    
    def test_agent_users_denied(self):
        """Agent should NOT access user management"""
        response = requests.get(f"{BASE_URL}/api/admin/users", headers=self.headers)
        assert response.status_code == 403, f"Expected 403 for users, got {response.status_code}"
        print(f"✓ Agent correctly denied access to user management")
    
    def test_agent_reports_denied(self):
        """Agent should NOT access reports"""
        response = requests.get(f"{BASE_URL}/api/admin/reports/payments", headers=self.headers)
        assert response.status_code == 403, f"Expected 403 for reports, got {response.status_code}"
        print(f"✓ Agent correctly denied access to reports")
    
    def test_agent_audit_logs_denied(self):
        """Agent should NOT access audit logs"""
        response = requests.get(f"{BASE_URL}/api/admin/audit-logs", headers=self.headers)
        assert response.status_code == 403, f"Expected 403 for audit logs, got {response.status_code}"
        print(f"✓ Agent correctly denied access to audit logs")
    
    def test_agent_inspections_access(self):
        """Agent should access inspections (scanner functionality)"""
        response = requests.get(f"{BASE_URL}/api/inspections", headers=self.headers)
        assert response.status_code == 200, f"Inspections access failed: {response.text}"
        print(f"✓ Agent can access inspections (scanner)")
    
    def test_agent_create_inspection(self):
        """Agent should create inspections"""
        response = requests.post(f"{BASE_URL}/api/inspections", headers=self.headers, json={
            "vehicle_registration": "TEST-123-NE",
            "status_at_control": "valid",
            "notes": "Test inspection by agent"
        })
        assert response.status_code == 200, f"Create inspection failed: {response.text}"
        print(f"✓ Agent can create inspections")


class TestUserCreation:
    """Test user creation based on role hierarchy"""
    
    def test_super_admin_can_create_admin(self):
        """Super Admin can create Admin users"""
        # Login as super admin
        login_resp = requests.post(f"{BASE_URL}/api/auth/admin/login", json={
            "username": "superadmin",
            "password": "superadmin123"
        })
        token = login_resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Create admin user
        response = requests.post(f"{BASE_URL}/api/admin/users", headers=headers, json={
            "username": "TEST_admin_new",
            "password": "testpass123",
            "role": "admin",
            "first_name": "Test",
            "last_name": "Admin"
        })
        assert response.status_code == 200, f"Create admin failed: {response.text}"
        print(f"✓ Super Admin can create Admin users")
    
    def test_super_admin_can_create_supervisor(self):
        """Super Admin can create Supervisor users"""
        login_resp = requests.post(f"{BASE_URL}/api/auth/admin/login", json={
            "username": "superadmin",
            "password": "superadmin123"
        })
        token = login_resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.post(f"{BASE_URL}/api/admin/users", headers=headers, json={
            "username": "TEST_sup_new",
            "password": "testpass123",
            "role": "supervisor",
            "first_name": "Test",
            "last_name": "Supervisor",
            "region": "Zinder"
        })
        assert response.status_code == 200, f"Create supervisor failed: {response.text}"
        print(f"✓ Super Admin can create Supervisor users")
    
    def test_admin_can_create_supervisor(self):
        """Admin can create Supervisor users"""
        login_resp = requests.post(f"{BASE_URL}/api/auth/admin/login", json={
            "username": "admin",
            "password": "admin123"
        })
        token = login_resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.post(f"{BASE_URL}/api/admin/users", headers=headers, json={
            "username": "TEST_sup_by_admin",
            "password": "testpass123",
            "role": "supervisor",
            "first_name": "Test",
            "last_name": "Supervisor",
            "region": "Dosso"
        })
        assert response.status_code == 200, f"Create supervisor failed: {response.text}"
        print(f"✓ Admin can create Supervisor users")
    
    def test_admin_cannot_create_admin(self):
        """Admin cannot create Admin users"""
        login_resp = requests.post(f"{BASE_URL}/api/auth/admin/login", json={
            "username": "admin",
            "password": "admin123"
        })
        token = login_resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.post(f"{BASE_URL}/api/admin/users", headers=headers, json={
            "username": "TEST_admin_by_admin",
            "password": "testpass123",
            "role": "admin",
            "first_name": "Test",
            "last_name": "Admin"
        })
        assert response.status_code == 403, f"Expected 403, got {response.status_code}"
        print(f"✓ Admin correctly denied creating Admin users")
    
    def test_supervisor_cannot_create_users(self):
        """Supervisor cannot create any users"""
        login_resp = requests.post(f"{BASE_URL}/api/auth/admin/login", json={
            "username": "sup_niamey",
            "password": "supervisor123"
        })
        token = login_resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.post(f"{BASE_URL}/api/admin/users", headers=headers, json={
            "username": "TEST_agent_by_sup",
            "password": "testpass123",
            "role": "agent",
            "first_name": "Test",
            "last_name": "Agent",
            "region": "Niamey"
        })
        assert response.status_code == 403, f"Expected 403, got {response.status_code}"
        print(f"✓ Supervisor correctly denied creating users")
    
    def test_supervisor_requires_region(self):
        """Supervisor creation requires region"""
        login_resp = requests.post(f"{BASE_URL}/api/auth/admin/login", json={
            "username": "superadmin",
            "password": "superadmin123"
        })
        token = login_resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.post(f"{BASE_URL}/api/admin/users", headers=headers, json={
            "username": "TEST_sup_no_region",
            "password": "testpass123",
            "role": "supervisor",
            "first_name": "Test",
            "last_name": "Supervisor"
            # No region provided
        })
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        print(f"✓ Supervisor creation correctly requires region")


class TestCitizenFlow:
    """Test citizen registration and vehicle/sticker flow"""
    
    def test_citizen_registration(self):
        """Citizen can register"""
        import random
        phone = f"+227{random.randint(10000000, 99999999)}"
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "phone": phone,
            "password": "testpass123",
            "first_name": "Test",
            "last_name": "Citizen"
        })
        assert response.status_code == 200, f"Registration failed: {response.text}"
        data = response.json()
        assert data["user"]["role"] == "citizen"
        print(f"✓ Citizen registration successful - phone: {phone}")
        return data["access_token"]
    
    def test_citizen_login(self):
        """Citizen can login"""
        # First register
        import random
        phone = f"+227{random.randint(10000000, 99999999)}"
        requests.post(f"{BASE_URL}/api/auth/register", json={
            "phone": phone,
            "password": "testpass123",
            "first_name": "Test",
            "last_name": "Citizen"
        })
        
        # Then login
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "phone": phone,
            "password": "testpass123"
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        print(f"✓ Citizen login successful")
    
    def test_citizen_vehicle_creation(self):
        """Citizen can create vehicle with region"""
        import random
        phone = f"+227{random.randint(10000000, 99999999)}"
        reg_resp = requests.post(f"{BASE_URL}/api/auth/register", json={
            "phone": phone,
            "password": "testpass123",
            "first_name": "Test",
            "last_name": "Citizen"
        })
        token = reg_resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        reg_num = f"TEST-{random.randint(1000, 9999)}-NE"
        response = requests.post(f"{BASE_URL}/api/vehicles", headers=headers, json={
            "registration_number": reg_num,
            "vehicle_type": "car",
            "make": "Toyota",
            "model": "Corolla",
            "energy_type": "gasoline",
            "engine_power": 120,
            "chassis_number": f"CHASSIS{random.randint(100000, 999999)}",
            "year_of_manufacture": 2020,
            "region": "Niamey"
        })
        assert response.status_code == 200, f"Vehicle creation failed: {response.text}"
        data = response.json()
        assert data["region"] == "Niamey"
        print(f"✓ Citizen vehicle creation successful - region: {data['region']}")
        return token, data["id"]
    
    def test_citizen_sticker_purchase(self):
        """Citizen can purchase sticker"""
        import random
        phone = f"+227{random.randint(10000000, 99999999)}"
        reg_resp = requests.post(f"{BASE_URL}/api/auth/register", json={
            "phone": phone,
            "password": "testpass123",
            "first_name": "Test",
            "last_name": "Citizen"
        })
        token = reg_resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Create vehicle
        reg_num = f"TEST-{random.randint(1000, 9999)}-NE"
        vehicle_resp = requests.post(f"{BASE_URL}/api/vehicles", headers=headers, json={
            "registration_number": reg_num,
            "vehicle_type": "car",
            "make": "Toyota",
            "model": "Corolla",
            "energy_type": "gasoline",
            "engine_power": 120,
            "chassis_number": f"CHASSIS{random.randint(100000, 999999)}",
            "year_of_manufacture": 2020,
            "region": "Niamey"
        })
        vehicle_id = vehicle_resp.json()["id"]
        
        # Purchase sticker
        response = requests.post(f"{BASE_URL}/api/stickers/purchase", headers=headers, json={
            "vehicle_id": vehicle_id,
            "validity_years": 1,
            "payment_method": "mobile_money"
        })
        assert response.status_code == 200, f"Sticker purchase failed: {response.text}"
        data = response.json()
        assert data["status"] == "valid"
        assert "qr_code" in data
        print(f"✓ Citizen sticker purchase successful - amount: {data['amount_paid']} FCFA")


class TestRegionFiltering:
    """Test that supervisors only see data from their region"""
    
    def test_supervisor_sees_only_own_region_vehicles(self):
        """Supervisor should only see vehicles from their region"""
        # First create a vehicle in Niamey region as citizen
        import random
        phone = f"+227{random.randint(10000000, 99999999)}"
        reg_resp = requests.post(f"{BASE_URL}/api/auth/register", json={
            "phone": phone,
            "password": "testpass123",
            "first_name": "Test",
            "last_name": "Citizen"
        })
        citizen_token = reg_resp.json()["access_token"]
        citizen_headers = {"Authorization": f"Bearer {citizen_token}"}
        
        # Create vehicle in Niamey
        reg_num_niamey = f"TEST-NIA-{random.randint(1000, 9999)}"
        requests.post(f"{BASE_URL}/api/vehicles", headers=citizen_headers, json={
            "registration_number": reg_num_niamey,
            "vehicle_type": "car",
            "make": "Toyota",
            "model": "Corolla",
            "energy_type": "gasoline",
            "engine_power": 120,
            "chassis_number": f"CHASSIS{random.randint(100000, 999999)}",
            "year_of_manufacture": 2020,
            "region": "Niamey"
        })
        
        # Create vehicle in Maradi
        phone2 = f"+227{random.randint(10000000, 99999999)}"
        reg_resp2 = requests.post(f"{BASE_URL}/api/auth/register", json={
            "phone": phone2,
            "password": "testpass123",
            "first_name": "Test2",
            "last_name": "Citizen2"
        })
        citizen_token2 = reg_resp2.json()["access_token"]
        citizen_headers2 = {"Authorization": f"Bearer {citizen_token2}"}
        
        reg_num_maradi = f"TEST-MAR-{random.randint(1000, 9999)}"
        requests.post(f"{BASE_URL}/api/vehicles", headers=citizen_headers2, json={
            "registration_number": reg_num_maradi,
            "vehicle_type": "car",
            "make": "Peugeot",
            "model": "308",
            "energy_type": "diesel",
            "engine_power": 150,
            "chassis_number": f"CHASSIS{random.randint(100000, 999999)}",
            "year_of_manufacture": 2021,
            "region": "Maradi"
        })
        
        # Login as Niamey supervisor
        sup_resp = requests.post(f"{BASE_URL}/api/auth/admin/login", json={
            "username": "sup_niamey",
            "password": "supervisor123"
        })
        sup_token = sup_resp.json()["access_token"]
        sup_headers = {"Authorization": f"Bearer {sup_token}"}
        
        # Get vehicles - should only see Niamey vehicles
        vehicles_resp = requests.get(f"{BASE_URL}/api/admin/vehicles", headers=sup_headers)
        vehicles = vehicles_resp.json()
        
        # Check all vehicles are from Niamey
        for v in vehicles:
            assert v.get("region") == "Niamey", f"Supervisor Niamey should not see vehicle from {v.get('region')}"
        
        print(f"✓ Supervisor Niamey only sees Niamey vehicles - {len(vehicles)} vehicles")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
