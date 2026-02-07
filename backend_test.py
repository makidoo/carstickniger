#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
import time

class NigerVignetteAPITester:
    def __init__(self, base_url="https://niger-sticker.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.citizen_token = None
        self.admin_token = None
        self.agent_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        
        # Test data with timestamp to avoid conflicts
        timestamp = datetime.now().strftime("%H%M%S%f")  # Include microseconds for uniqueness
        self.test_citizen = {
            "phone": f"+227901{timestamp[-6:]}",
            "password": "TestPass123!",
            "first_name": "Amadou",
            "last_name": "Diallo",
            "email": f"amadou.diallo.{timestamp}@test.ne",
            "national_id": f"NIN12345678{timestamp[-1:]}"
        }
        
        self.test_vehicle = {
            "registration_number": f"AB-{timestamp[-6:]}-NE",
            "vehicle_type": "car",
            "make": "Toyota",
            "model": "Land Cruiser",
            "energy_type": "diesel",
            "engine_power": 150,
            "chassis_number": f"VIN123456789ABCDE{timestamp[-1:]}",
            "year_of_manufacture": 2020
        }

    def log_result(self, test_name, success, details="", error=""):
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "error": error,
            "timestamp": datetime.now().isoformat()
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, auth_token=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if auth_token:
            test_headers['Authorization'] = f'Bearer {auth_token}'
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {method} {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json() if response.content else {}
                    self.log_result(name, True, f"Status: {response.status_code}", "")
                    return True, response_data
                except:
                    self.log_result(name, True, f"Status: {response.status_code}", "")
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json().get('detail', 'Unknown error')
                except:
                    error_detail = response.text[:200] if response.text else 'No response body'
                print(f"   Error: {error_detail}")
                self.log_result(name, False, f"Status: {response.status_code}", error_detail)
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.log_result(name, False, "", str(e))
            return False, {}

    def test_seed_data(self):
        """Test seeding default data"""
        print("\n" + "="*50)
        print("TESTING: Seed Data Creation")
        print("="*50)
        
        success, response = self.run_test(
            "Seed Default Data",
            "POST",
            "seed",
            200
        )
        
        if success:
            print(f"✅ Seed data created successfully")
            print(f"   Admin credentials: admin / admin123")
            print(f"   Agent credentials: agent001 / agent123")
        
        return success

    def test_citizen_registration(self):
        """Test citizen registration"""
        print("\n" + "="*50)
        print("TESTING: Citizen Registration")
        print("="*50)
        
        success, response = self.run_test(
            "Citizen Registration",
            "POST",
            "auth/register",
            200,
            data=self.test_citizen
        )
        
        if success and 'access_token' in response:
            self.citizen_token = response['access_token']
            print(f"✅ Citizen registered and logged in")
            print(f"   User ID: {response.get('user', {}).get('id', 'N/A')}")
            print(f"   Phone: {response.get('user', {}).get('phone', 'N/A')}")
        
        return success

    def test_citizen_login(self):
        """Test citizen login"""
        print("\n" + "="*50)
        print("TESTING: Citizen Login")
        print("="*50)
        
        login_data = {
            "phone": self.test_citizen["phone"],
            "password": self.test_citizen["password"]
        }
        
        success, response = self.run_test(
            "Citizen Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success and 'access_token' in response:
            self.citizen_token = response['access_token']
            print(f"✅ Citizen login successful")
        
        return success

    def test_admin_login(self):
        """Test admin login"""
        print("\n" + "="*50)
        print("TESTING: Admin Login")
        print("="*50)
        
        admin_data = {
            "phone": "admin",
            "password": "admin123"
        }
        
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/admin/login",
            200,
            data=admin_data
        )
        
        if success and 'access_token' in response:
            self.admin_token = response['access_token']
            print(f"✅ Admin login successful")
            print(f"   Role: {response.get('user', {}).get('role', 'N/A')}")
        
        return success

    def test_agent_login(self):
        """Test agent login"""
        print("\n" + "="*50)
        print("TESTING: Agent Login")
        print("="*50)
        
        agent_data = {
            "phone": "agent001",
            "password": "agent123"
        }
        
        success, response = self.run_test(
            "Agent Login",
            "POST",
            "auth/admin/login",
            200,
            data=agent_data
        )
        
        if success and 'access_token' in response:
            self.agent_token = response['access_token']
            print(f"✅ Agent login successful")
            print(f"   Role: {response.get('user', {}).get('role', 'N/A')}")
        
        return success

    def test_vehicle_creation(self):
        """Test vehicle creation"""
        print("\n" + "="*50)
        print("TESTING: Vehicle Creation")
        print("="*50)
        
        if not self.citizen_token:
            print("❌ No citizen token available")
            return False
        
        success, response = self.run_test(
            "Create Vehicle",
            "POST",
            "vehicles",
            200,
            data=self.test_vehicle,
            auth_token=self.citizen_token
        )
        
        if success:
            self.vehicle_id = response.get('id')
            print(f"✅ Vehicle created successfully")
            print(f"   Vehicle ID: {self.vehicle_id}")
            print(f"   Registration: {response.get('registration_number')}")
        
        return success

    def test_get_vehicles(self):
        """Test getting user vehicles"""
        print("\n" + "="*50)
        print("TESTING: Get User Vehicles")
        print("="*50)
        
        if not self.citizen_token:
            print("❌ No citizen token available")
            return False
        
        success, response = self.run_test(
            "Get User Vehicles",
            "GET",
            "vehicles",
            200,
            auth_token=self.citizen_token
        )
        
        if success:
            vehicle_count = len(response) if isinstance(response, list) else 0
            print(f"✅ Retrieved {vehicle_count} vehicles")
        
        return success

    def test_sticker_purchase(self):
        """Test sticker purchase"""
        print("\n" + "="*50)
        print("TESTING: Sticker Purchase")
        print("="*50)
        
        if not self.citizen_token or not hasattr(self, 'vehicle_id'):
            print("❌ No citizen token or vehicle ID available")
            return False
        
        purchase_data = {
            "vehicle_id": self.vehicle_id,
            "validity_years": 1,
            "payment_method": "mobile_money"
        }
        
        success, response = self.run_test(
            "Purchase Sticker",
            "POST",
            "stickers/purchase",
            200,
            data=purchase_data,
            auth_token=self.citizen_token
        )
        
        if success:
            self.sticker_id = response.get('id')
            print(f"✅ Sticker purchased successfully")
            print(f"   Sticker ID: {self.sticker_id}")
            print(f"   Amount: {response.get('amount_paid')} FCFA")
            print(f"   Transaction ID: {response.get('transaction_id')}")
            print(f"   Loyalty Points: {response.get('loyalty_points')}")
        
        return success

    def test_get_stickers(self):
        """Test getting user stickers"""
        print("\n" + "="*50)
        print("TESTING: Get User Stickers")
        print("="*50)
        
        if not self.citizen_token:
            print("❌ No citizen token available")
            return False
        
        success, response = self.run_test(
            "Get User Stickers",
            "GET",
            "stickers",
            200,
            auth_token=self.citizen_token
        )
        
        if success:
            sticker_count = len(response) if isinstance(response, list) else 0
            print(f"✅ Retrieved {sticker_count} stickers")
        
        return success

    def test_vehicle_verification(self):
        """Test vehicle verification"""
        print("\n" + "="*50)
        print("TESTING: Vehicle Verification")
        print("="*50)
        
        success, response = self.run_test(
            "Verify Vehicle",
            "GET",
            f"verify/{self.test_vehicle['registration_number']}",
            200
        )
        
        if success:
            print(f"✅ Vehicle verification successful")
            print(f"   Registration: {response.get('registration_number')}")
            print(f"   Owner: {response.get('owner_name')}")
            print(f"   Status: {response.get('status')}")
            print(f"   Vehicle Type: {response.get('vehicle_type')}")
        
        return success

    def test_admin_dashboard(self):
        """Test admin dashboard"""
        print("\n" + "="*50)
        print("TESTING: Admin Dashboard")
        print("="*50)
        
        if not self.admin_token:
            print("❌ No admin token available")
            return False
        
        success, response = self.run_test(
            "Admin Dashboard Stats",
            "GET",
            "admin/dashboard",
            200,
            auth_token=self.admin_token
        )
        
        if success:
            print(f"✅ Admin dashboard loaded successfully")
            print(f"   Total Vehicles: {response.get('total_vehicles', 0)}")
            print(f"   Active Stickers: {response.get('active_stickers', 0)}")
            print(f"   Total Revenue: {response.get('total_revenue', 0)} FCFA")
            print(f"   Recovery Rate: {response.get('recovery_rate', 0)}%")
        
        return success

    def test_agent_inspection(self):
        """Test agent inspection creation"""
        print("\n" + "="*50)
        print("TESTING: Agent Inspection")
        print("="*50)
        
        if not self.agent_token:
            print("❌ No agent token available")
            return False
        
        inspection_data = {
            "vehicle_registration": self.test_vehicle['registration_number'],
            "status_at_control": "valid",
            "latitude": 13.5137,
            "longitude": 2.1098,
            "notes": "Contrôle de routine - RAS"
        }
        
        success, response = self.run_test(
            "Create Inspection",
            "POST",
            "inspections",
            200,
            data=inspection_data,
            auth_token=self.agent_token
        )
        
        if success:
            print(f"✅ Inspection created successfully")
            print(f"   Inspection ID: {response.get('id')}")
            print(f"   Vehicle: {response.get('vehicle_registration')}")
            print(f"   Status: {response.get('status_at_control')}")
        
        return success

    def test_get_inspections(self):
        """Test getting inspections"""
        print("\n" + "="*50)
        print("TESTING: Get Inspections")
        print("="*50)
        
        if not self.agent_token:
            print("❌ No agent token available")
            return False
        
        success, response = self.run_test(
            "Get Inspections",
            "GET",
            "inspections?limit=10",
            200,
            auth_token=self.agent_token
        )
        
        if success:
            inspection_count = len(response) if isinstance(response, list) else 0
            print(f"✅ Retrieved {inspection_count} inspections")
        
        return success

    def test_payment_history(self):
        """Test payment history"""
        print("\n" + "="*50)
        print("TESTING: Payment History")
        print("="*50)
        
        if not self.citizen_token:
            print("❌ No citizen token available")
            return False
        
        success, response = self.run_test(
            "Get Payment History",
            "GET",
            "payments",
            200,
            auth_token=self.citizen_token
        )
        
        if success:
            payment_count = len(response) if isinstance(response, list) else 0
            print(f"✅ Retrieved {payment_count} payments")
        
        return success

    def test_loyalty_points(self):
        """Test loyalty points"""
        print("\n" + "="*50)
        print("TESTING: Loyalty Points")
        print("="*50)
        
        if not self.citizen_token:
            print("❌ No citizen token available")
            return False
        
        success, response = self.run_test(
            "Get Loyalty Points",
            "GET",
            "loyalty/points",
            200,
            auth_token=self.citizen_token
        )
        
        if success:
            points = response.get('points', 0)
            print(f"✅ Retrieved loyalty points: {points}")
        
        return success

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Niger Digital Vehicle Sticker System API Tests")
        print(f"📍 Base URL: {self.base_url}")
        print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Test sequence
        tests = [
            ("Seed Data", self.test_seed_data),
            ("Citizen Registration", self.test_citizen_registration),
            ("Admin Login", self.test_admin_login),
            ("Agent Login", self.test_agent_login),
            ("Vehicle Creation", self.test_vehicle_creation),
            ("Get Vehicles", self.test_get_vehicles),
            ("Sticker Purchase", self.test_sticker_purchase),
            ("Get Stickers", self.test_get_stickers),
            ("Vehicle Verification", self.test_vehicle_verification),
            ("Admin Dashboard", self.test_admin_dashboard),
            ("Agent Inspection", self.test_agent_inspection),
            ("Get Inspections", self.test_get_inspections),
            ("Payment History", self.test_payment_history),
            ("Loyalty Points", self.test_loyalty_points)
        ]
        
        for test_name, test_func in tests:
            try:
                test_func()
                time.sleep(1)  # Brief pause between tests
            except Exception as e:
                print(f"❌ {test_name} failed with exception: {str(e)}")
                self.log_result(test_name, False, "", str(e))
        
        # Print final results
        print("\n" + "="*60)
        print("🏁 TEST SUMMARY")
        print("="*60)
        print(f"📊 Tests passed: {self.tests_passed}/{self.tests_run}")
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"📈 Success rate: {success_rate:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
        else:
            print("⚠️  Some tests failed. Check details above.")
        
        return self.tests_passed == self.tests_run

def main():
    tester = NigerVignetteAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())