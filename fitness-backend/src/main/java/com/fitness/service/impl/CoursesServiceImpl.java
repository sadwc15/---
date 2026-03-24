package com.fitness.service.impl;

import com.fitness.entity.Courses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fitness.mapper.CoursesMapper;
import com.fitness.service.ICoursesService;

import java.util.List;

@Service
public class CoursesServiceImpl implements ICoursesService
{
    @Autowired
    private CoursesMapper coursesMapper;

    /**
     * 查询课程管理
     *
     * @param id 课程管理主键
     * @return 课程管理
     */
    @Override
    public Courses selectCoursesById(Long id)
    {
        return coursesMapper.selectCoursesById(id);
    }

    /**
     * 查询课程管理列表
     *
     * @param courses 课程管理
     * @return 课程管理
     */
    @Override
    public List<Courses> selectCoursesList(Courses courses)
    {
        return coursesMapper.selectCoursesList(courses);
    }

    /**
     * 新增课程管理
     *
     * @param courses 课程管理
     * @return 结果
     */
    @Override
    public int insertCourses(Courses courses)
    {
        return coursesMapper.insertCourses(courses);
    }

    /**
     * 修改课程管理
     *
     * @param courses 课程管理
     * @return 结果
     */
    @Override
    public int updateCourses(Courses courses)
    {
        return coursesMapper.updateCourses(courses);
    }

    /**
     * 批量删除课程管理
     *
     * @param ids 需要删除的课程管理主键
     * @return 结果
     */
    @Override
    public int deleteCoursesByIds(Long[] ids)
    {
        return coursesMapper.deleteCoursesByIds(ids);
    }

    /**
     * 删除课程管理信息
     *
     * @param id 课程管理主键
     * @return 结果
     */
    @Override
    public int deleteCoursesById(Long id)
    {
        return coursesMapper.deleteCoursesById(id);
    }
}
