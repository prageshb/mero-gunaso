package com.pragesh.merogunaso.service;

import com.pragesh.merogunaso.entity.Department;
import com.pragesh.merogunaso.repository.DepartmentRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Optional<Department> getDepartmentById(ObjectId id) {
        return departmentRepository.findById(id);
    }

    public Department createDepartment(Department department) {
        return departmentRepository.save(department);
    }

    public Department updateDepartment(ObjectId id, Department updatedInfo) {
        return departmentRepository.findById(id).map(existing -> {
            if (updatedInfo.getName() != null) {
                existing.setName(updatedInfo.getName());
            }
            if (updatedInfo.getDescription() != null) {
                existing.setDescription(updatedInfo.getDescription());
            }
            return departmentRepository.save(existing);
        }).orElse(null);
    }

    public void deleteDepartment(ObjectId id) {
        departmentRepository.deleteById(id);
    }
}
