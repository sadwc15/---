package com.fitness.service;

import com.fitness.entity.Courses;
import java.util.List;

/**
 * 课程管理Service接口
 *
 * @author ruoyi
 * @date 2026-03-15
 */
public interface ICoursesService
{
    /**
     * 查询课程管理
     *
     * @param id 课程管理主键
     * @return 课程管理
     */
    public Courses selectCoursesById(Long id);

    /**
     * 查询课程管理列表
     *
     * @param courses 课程管理
     * @return 课程管理集合
     */
    public List<Courses> selectCoursesList(Courses courses);

    /**
     * 新增课程管理
     *
     * @param courses 课程管理
     * @return 结果
     */
    public int insertCourses(Courses courses);

    /**
     * 修改课程管理
     *
     * @param courses 课程管理
     * @return 结果
     */
    public int updateCourses(Courses courses);

    /**
     * 批量删除课程管理
     *
     * @param ids 需要删除的课程管理主键集合
     * @return 结果
     */
    public int deleteCoursesByIds(Long[] ids);

    /**
     * 删除课程管理信息
     *
     * @param id 课程管理主键
     * @return 结果
     */
    public int deleteCoursesById(Long id);
}
