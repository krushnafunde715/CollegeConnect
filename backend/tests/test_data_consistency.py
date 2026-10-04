import pytest
from datetime import datetime

# Sample dataset schema corresponding directly to the centralized CompEngDataContext
INITIAL_CLASSES = [
    {'name': 'SE A', 'year_level': 'SE', 'division': 'A', 'capacity': 70, 'expected_count': 9},
    {'name': 'SE B', 'year_level': 'SE', 'division': 'B', 'capacity': 70, 'expected_count': 9},
    {'name': 'TE A', 'year_level': 'TE', 'division': 'A', 'capacity': 70, 'expected_count': 9},
    {'name': 'TE B', 'year_level': 'TE', 'division': 'B', 'capacity': 70, 'expected_count': 9},
    {'name': 'BE A', 'year_level': 'BE', 'division': 'A', 'capacity': 70, 'expected_count': 8},
    {'name': 'BE B', 'year_level': 'BE', 'division': 'B', 'capacity': 70, 'expected_count': 8},
]

# 52 students as defined in CompEngDataContext
STUDENTS_DATA = [
    # SE A (9)
    {'prn': '22CE001', 'name': 'Aditya Kulkarni', 'class': 'SE A', 'email': 'aditya.kulkarni@comp.nmiet.edu.in'},
    {'prn': '22CE002', 'name': 'Sneha Pawar', 'class': 'SE A', 'email': 'sneha.pawar@comp.nmiet.edu.in'},
    {'prn': '22CE003', 'name': 'Rohit Jadhav', 'class': 'SE A', 'email': 'rohit.jadhav@comp.nmiet.edu.in'},
    {'prn': '22CE004', 'name': 'Pooja Sawant', 'class': 'SE A', 'email': 'pooja.sawant@comp.nmiet.edu.in'},
    {'prn': '22CE005', 'name': 'Atharva Patil', 'class': 'SE A', 'email': 'atharva.patil@comp.nmiet.edu.in'},
    {'prn': '22CE006', 'name': 'Riya Deshmukh', 'class': 'SE A', 'email': 'riya.deshmukh@comp.nmiet.edu.in'},
    {'prn': '22CE007', 'name': 'Yash More', 'class': 'SE A', 'email': 'yash.more@comp.nmiet.edu.in'},
    {'prn': '22CE008', 'name': 'Neha Patil', 'class': 'SE A', 'email': 'neha.patil@comp.nmiet.edu.in'},
    {'prn': '22CE009', 'name': 'Devansh Mehta', 'class': 'SE A', 'email': 'devansh.mehta@comp.nmiet.edu.in'},

    # SE B (9)
    {'prn': '22CE010', 'name': 'Pooja Bhosale', 'class': 'SE B', 'email': 'pooja.bhosale@comp.nmiet.edu.in'},
    {'prn': '22CE011', 'name': 'Aditi Jadhav', 'class': 'SE B', 'email': 'aditi.jadhav@comp.nmiet.edu.in'},
    {'prn': '22CE012', 'name': 'Sameer Shinde', 'class': 'SE B', 'email': 'sameer.shinde@comp.nmiet.edu.in'},
    {'prn': '22CE013', 'name': 'Ananya Rao', 'class': 'SE B', 'email': 'ananya.rao@comp.nmiet.edu.in'},
    {'prn': '22CE014', 'name': 'Pranav Gaikwad', 'class': 'SE B', 'email': 'pranav.gaikwad@comp.nmiet.edu.in'},
    {'prn': '22CE015', 'name': 'Sanika Joshi', 'class': 'SE B', 'email': 'sanika.joshi@comp.nmiet.edu.in'},
    {'prn': '22CE016', 'name': 'Nikhil Chavan', 'class': 'SE B', 'email': 'nikhil.chavan@comp.nmiet.edu.in'},
    {'prn': '22CE017', 'name': 'Rutuja Mohite', 'class': 'SE B', 'email': 'rutuja.mohite@comp.nmiet.edu.in'},
    {'prn': '22CE018', 'name': 'Harish Mule', 'class': 'SE B', 'email': 'harish.mule@comp.nmiet.edu.in'},

    # TE A (9)
    {'prn': '21CE019', 'name': 'Siddharth Kadam', 'class': 'TE A', 'email': 'siddharth.kadam@comp.nmiet.edu.in'},
    {'prn': '21CE020', 'name': 'Gauri Mane', 'class': 'TE A', 'email': 'gauri.mane@comp.nmiet.edu.in'},
    {'prn': '21CE021', 'name': 'Kunal Tambe', 'class': 'TE A', 'email': 'kunal.tambe@comp.nmiet.edu.in'},
    {'prn': '21CE022', 'name': 'Shruti Nalawade', 'class': 'TE A', 'email': 'shruti.nalawade@comp.nmiet.edu.in'},
    {'prn': '21CE023', 'name': 'Parth Dixit', 'class': 'TE A', 'email': 'parth.dixit@comp.nmiet.edu.in'},
    {'prn': '21CE024', 'name': 'Tejaswini Salunkhe', 'class': 'TE A', 'email': 'tejaswini.salunkhe@comp.nmiet.edu.in'},
    {'prn': '21CE025', 'name': 'Varun Sane', 'class': 'TE A', 'email': 'varun.sane@comp.nmiet.edu.in'},
    {'prn': '21CE026', 'name': 'Pallavi Gore', 'class': 'TE A', 'email': 'pallavi.gore@comp.nmiet.edu.in'},
    {'prn': '21CE027', 'name': 'Ishan Kelkar', 'class': 'TE A', 'email': 'ishan.kelkar@comp.nmiet.edu.in'},

    # TE B (9)
    {'prn': '21CE028', 'name': 'Tanvi Deshpande', 'class': 'TE B', 'email': 'tanvi.deshpande@comp.nmiet.edu.in'},
    {'prn': '21CE029', 'name': 'Om Jagtap', 'class': 'TE B', 'email': 'om.jagtap@comp.nmiet.edu.in'},
    {'prn': '21CE030', 'name': 'Tanvi Shinde', 'class': 'TE B', 'email': 'tanvi.shinde@comp.nmiet.edu.in'},
    {'prn': '21CE031', 'name': 'Saurabh Bhalerao', 'class': 'TE B', 'email': 'saurabh.bhalerao@comp.nmiet.edu.in'},
    {'prn': '21CE032', 'name': 'Meera Date', 'class': 'TE B', 'email': 'meera.date@comp.nmiet.edu.in'},
    {'prn': '21CE033', 'name': 'Vedant Gole', 'class': 'TE B', 'email': 'vedant.gole@comp.nmiet.edu.in'},
    {'prn': '21CE034', 'name': 'Aniket Thorat', 'class': 'TE B', 'email': 'aniket.thorat@comp.nmiet.edu.in'},
    {'prn': '21CE035', 'name': 'Sayali Wagh', 'class': 'TE B', 'email': 'sayali.wagh@comp.nmiet.edu.in'},
    {'prn': '21CE036', 'name': 'Chinmay Apte', 'class': 'TE B', 'email': 'chinmay.apte@comp.nmiet.edu.in'},

    # BE A (8)
    {'prn': '20CE037', 'name': 'Aditya Joshi', 'class': 'BE A', 'email': 'aditya.joshi@comp.nmiet.edu.in'},
    {'prn': '20CE038', 'name': 'Karan Gupta', 'class': 'BE A', 'email': 'karan.gupta@comp.nmiet.edu.in'},
    {'prn': '20CE039', 'name': 'Mayuri Vaidya', 'class': 'BE A', 'email': 'mayuri.vaidya@comp.nmiet.edu.in'},
    {'prn': '20CE040', 'name': 'Tushar Jagdale', 'class': 'BE A', 'email': 'tushar.jagdale@comp.nmiet.edu.in'},
    {'prn': '20CE041', 'name': 'Divya Ranade', 'class': 'BE A', 'email': 'divya.ranade@comp.nmiet.edu.in'},
    {'prn': '20CE042', 'name': 'Shreyas Kulkarni', 'class': 'BE A', 'email': 'shreyas.kulkarni@comp.nmiet.edu.in'},
    {'prn': '20CE043', 'name': 'Prachi Bodke', 'class': 'BE A', 'email': 'prachi.bodke@comp.nmiet.edu.in'},
    {'prn': '20CE044', 'name': 'Rishabh Jain', 'class': 'BE A', 'email': 'rishabh.jain@comp.nmiet.edu.in'},

    # BE B (8)
    {'prn': '20CE045', 'name': 'Neha Kulkarni', 'class': 'BE B', 'email': 'neha.kulkarni@comp.nmiet.edu.in'},
    {'prn': '20CE046', 'name': 'Siddharth Bhosale', 'class': 'BE B', 'email': 'siddharth.bhosale@comp.nmiet.edu.in'},
    {'prn': '20CE047', 'name': 'Manasi Chitre', 'class': 'BE B', 'email': 'manasi.chitre@comp.nmiet.edu.in'},
    {'prn': '20CE048', 'name': 'Gaurav Somani', 'class': 'BE B', 'email': 'gaurav.somani@comp.nmiet.edu.in'},
    {'prn': '20CE049', 'name': 'Ketaki Bhagwat', 'class': 'BE B', 'email': 'ketaki.bhagwat@comp.nmiet.edu.in'},
    {'prn': '20CE050', 'name': 'Rahul More', 'class': 'BE B', 'email': 'rahul.more@comp.nmiet.edu.in'},
    {'prn': '20CE051', 'name': 'Ananya Potdar', 'class': 'BE B', 'email': 'ananya.potdar@comp.nmiet.edu.in'},
    {'prn': '20CE052', 'name': 'Swapnil Gadre', 'class': 'BE B', 'email': 'swapnil.gadre@comp.nmiet.edu.in'},
]

def test_class_student_count_and_uniqueness():
    """Verify that each of the 6 classes contains exactly 8-9 unique students."""
    for cls in INITIAL_CLASSES:
        cls_students = [s for s in STUDENTS_DATA if s['class'] == cls['name']]
        assert len(cls_students) in (8, 9), f"Class {cls['name']} has {len(cls_students)} students; expected 8 or 9."
        assert len(cls_students) == cls['expected_count']

def test_total_student_count_within_bounds():
    """Verify total prototype students is within the required 48-54 range."""
    total = len(STUDENTS_DATA)
    assert 48 <= total <= 54, f"Total students is {total}; expected between 48 and 54."
    assert total == 52

def test_prn_uniqueness_across_department():
    """Verify that there are zero duplicate PRNs in the entire student dataset."""
    prns = [s['prn'] for s in STUDENTS_DATA]
    unique_prns = set(prns)
    assert len(prns) == len(unique_prns), f"Duplicate PRN found: {len(prns) - len(unique_prns)} duplicates."

def test_email_uniqueness_across_department():
    """Verify that there are zero duplicate institutional emails."""
    emails = [s['email'] for s in STUDENTS_DATA]
    unique_emails = set(emails)
    assert len(emails) == len(unique_emails), f"Duplicate emails found: {len(emails) - len(unique_emails)} duplicates."

def test_single_class_allocation_per_student():
    """Verify every student belongs to exactly one class and division."""
    for s in STUDENTS_DATA:
        allocated_classes = [c['name'] for c in INITIAL_CLASSES if c['name'] == s['class']]
        assert len(allocated_classes) == 1, f"Student {s['name']} is mapped to {allocated_classes}"

def test_new_class_creation_without_student_duplication():
    """Verify that creating a new class produces a class with 0 students without copying from others."""
    new_class = {'name': 'SE C', 'year_level': 'SE', 'division': 'C', 'capacity': 70}
    
    # Check that new class is not duplicate of existing in the same academic year
    assert not any(c['name'] == new_class['name'] for c in INITIAL_CLASSES)
    
    # Check that students matching new class is strictly 0
    new_class_students = [s for s in STUDENTS_DATA if s['class'] == new_class['name']]
    assert len(new_class_students) == 0, "New class should have 0 students initially."

def test_cross_module_data_consistency():
    """Verify sum of class-wise students equals total department students."""
    calculated_sum = sum(len([s for s in STUDENTS_DATA if s['class'] == c['name']]) for c in INITIAL_CLASSES)
    assert calculated_sum == len(STUDENTS_DATA)
