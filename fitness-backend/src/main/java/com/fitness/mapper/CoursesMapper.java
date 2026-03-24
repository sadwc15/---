package com.fitness.mapper;

import com.fitness.entity.Courses;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;


/**
 * 课程管理Mapper接口
 *
 * @author ruoyi
 * @date 2026-03-15
 */
@Mapper
public interface CoursesMapper
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
     * 删除课程管理
     *
     * @param id 课程管理主键
     * @return 结果
     */
    public int deleteCoursesById(Long id);

    /**
     * 批量删除课程管理
     *
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteCoursesByIds(Long[] ids);
}
