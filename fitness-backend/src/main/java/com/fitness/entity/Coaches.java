package com.fitness.entity;

import java.util.Date;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

/**
 * 教练信息管理对象 coaches
 */
public class Coaches
{
    private static final long serialVersionUID = 1L;

    private Long id;

    private String name;

    private String expertise;

    private String bio;

    private String avatar;

    private Date lastLoginTime;

    private Long loginCount;

    private String password;

    private String phone;

    private String tags;

    public void setId(Long id)
    {
        this.id = id;
    }

    public Long getId()
    {
        return id;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public String getName()
    {
        return name;
    }

    public void setExpertise(String expertise)
    {
        this.expertise = expertise;
    }

    public String getExpertise()
    {
        return expertise;
    }

    public void setBio(String bio)
    {
        this.bio = bio;
    }

    public String getBio()
    {
        return bio;
    }

    public void setAvatar(String avatar)
    {
        this.avatar = avatar;
    }

    public String getAvatar()
    {
        return avatar;
    }

    public void setLastLoginTime(Date lastLoginTime)
    {
        this.lastLoginTime = lastLoginTime;
    }

    public Date getLastLoginTime()
    {
        return lastLoginTime;
    }

    public void setLoginCount(Long loginCount)
    {
        this.loginCount = loginCount;
    }

    public Long getLoginCount()
    {
        return loginCount;
    }

    public void setPassword(String password)
    {
        this.password = password;
    }

    public String getPassword()
    {
        return password;
    }

    public void setPhone(String phone)
    {
        this.phone = phone;
    }

    public String getPhone()
    {
        return phone;
    }

    public void setTags(String tags)
    {
        this.tags = tags;
    }

    public String getTags()
    {
        return tags;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this,ToStringStyle.MULTI_LINE_STYLE)
            .append("id", getId())
            .append("name", getName())
            .append("expertise", getExpertise())
            .append("bio", getBio())
            .append("avatar", getAvatar())
            .append("lastLoginTime", getLastLoginTime())
            .append("loginCount", getLoginCount())
            .append("password", getPassword())
            .append("phone", getPhone())
            .append("tags", getTags())
            .toString();
    }
}
