package com.fitness.entity;

import java.util.Date;
/**
 * 课程管理对象 courses
 *
 * @author ruoyi
 * @date 2026-03-15
 */
public class Courses
{
    private static final long serialVersionUID = 1L;

    private Long id;

    private String title;

    private String description;

    private String type;

    private Long price;

    private Long capacity;

    private Date startTime;

    private Long coachId;

    private Long duration;

    private String image;

    public void setId(Long id)
    {
        this.id = id;
    }

    public Long getId()
    {
        return id;
    }

    public void setTitle(String title)
    {
        this.title = title;
    }

    public String getTitle()
    {
        return title;
    }

    public void setDescription(String description)
    {
        this.description = description;
    }

    public String getDescription()
    {
        return description;
    }

    public void setType(String type)
    {
        this.type = type;
    }

    public String getType()
    {
        return type;
    }

    public void setPrice(Long price)
    {
        this.price = price;
    }

    public Long getPrice()
    {
        return price;
    }

    public void setCapacity(Long capacity)
    {
        this.capacity = capacity;
    }

    public Long getCapacity()
    {
        return capacity;
    }

    public void setStartTime(Date startTime)
    {
        this.startTime = startTime;
    }

    public Date getStartTime()
    {
        return startTime;
    }

    public void setCoachId(Long coachId)
    {
        this.coachId = coachId;
    }

    public Long getCoachId()
    {
        return coachId;
    }

    public void setDuration(Long duration)
    {
        this.duration = duration;
    }

    public Long getDuration()
    {
        return duration;
    }

    public void setImage(String image)
    {
        this.image = image;
    }

    public String getImage()
    {
        return image;
    }

    @Override
    public String toString() {
        return "Courses{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", type='" + type + '\'' +
                ", price=" + price +
                ", capacity=" + capacity +
                ", startTime=" + startTime +
                ", coachId=" + coachId +
                ", duration=" + duration +
                ", image='" + image + '\'' +
                '}';
    }
}
