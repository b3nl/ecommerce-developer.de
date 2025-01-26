---
slug: "december-2024-issue-of-php_architect"
title: "Review of php[architect] December 2024"
description: "An in-depth review of the latest issue of php[architect], highlighting key takeaways and recommendations for PHP developers."
tags: ["php", "developers", "magazine review", "enums", "solid", "unit tests", "rector", "accessibility", "laravel", "security"]
featured: true
pubDatetime: 2025-01-23T21:30:00Z
---

# Review of php[architect] December 2024

## Introduction

As 2024 comes to a close, the December issue of *php[architect]* serves as both a reflection of the past year and a valuable resource for PHP developers. Packed with articles ranging from fundamental principles to modern tools, this issue demonstrates why PHP remains one of the most vibrant and innovative developer communities. Below, I provide my take on the standout articles, highlighting their key messages, relevance, and how they resonate with my own experiences.

---

### **Building a SOLID Foundation: Principles for Better Software Design**

Cori Lint’s exploration of the SOLID principles offers a clear and actionable framework for combating "software rot." The analogy of *software rot* (rigidity, fragility, immobility, and viscosity) resonates deeply with anyone who has worked in aging codebases. Lint’s key takeaway is simple yet profound: investing in clean, maintainable design today saves immense effort tomorrow.

I particularly appreciated the emphasis on incremental adoption of SOLID principles and other complementary guidelines like **DRY** (Don’t Repeat Yourself) and the **Boy Scout Rule** ("always leave the code cleaner than you found it"). While SOLID is essential knowledge, Lint’s focus on practical, gradual implementation makes the article a must-read for developers striving to improve their craft.

*Verdict:* My favorite article of this issue – a timeless reminder to invest in quality early and often.

---

### **Programmer’s Guide to Legacy Upgrade**

Tomáš Votruba dives into the challenges of upgrading legacy systems, drawing from his extensive experience with Rector. What struck me most was the human element: the importance of building trust, aligning goals, and creating a culture where code quality is the norm, not the exception.

Highlights from the article include:
- **Abgeschlossene Pull Requests:** Every pull request should deliver completed, valuable work – no drafts or partial experiments.
- **Merge within a day:** Votruba’s rule that PRs should be merged within ca. 24 hours to maintain momentum aligns with best practices I encourage in my own teams.
- **Slack as an anti-pattern:** A strong point that resonated with me: discussions about code belong in personal meetings with code review platforms, not endless chat threads.

This article reinforces the importance of discipline, both technically and culturally, in tackling legacy upgrades.

*Verdict:* Highly relevant for teams grappling with legacy projects.

---

### **Small Things Matter**

Maxwell Ivey’s article is a heartfelt reminder of the importance of accessibility in software development. Drawing from his personal experiences as a blind user, Ivey highlights how seemingly minor issues, like unlabelled buttons or poorly designed forms, can create major barriers for users with disabilities.

Key takeaways include:
- Accessibility isn’t optional: Developers have a responsibility to ensure inclusivity.
- Small details matter: Even a single unlabeled button can prevent someone from accessing critical features.
- Avoid unnecessary complexity: Keep navigation and interactions consistent and clear.

For me, this article was a "must-read." It reinforces the need to incorporate accessibility as a core part of the development process, not an afterthought.

*Verdict:* Essential reading for anyone building user-facing applications.

---

### **Building an API Starter Kit for Laravel**

Steve McDougall provides a practical walkthrough of an API starter kit for Laravel, with code available on GitHub. While the article is straightforward, it’s a valuable resource for developers seeking to standardize and streamline their API workflows in Laravel projects.

*Verdict:* A useful read for Laravel developers, especially those new to API design.

---

### **Watching The Clock**

Eric Mann’s guide to password hashing and security is a concise yet important reminder: use native PHP functions like `password_hash()` and `password_verify()` – and never roll your own cryptography. Mann’s emphasis on regular rehashing to adjust hashing costs as hardware improves is especially relevant for long-term security.

*Verdict:* A practical article with actionable advice for developers handling authentication.

---

### **The Revolution That Set The Standard: PHP 3.0**

Christopher Miller’s retrospective on PHP 3.0 is a fascinating look at how this version set the foundation for modern PHP. It’s always inspiring to revisit the roots of the technologies we use daily, and this article does a great job highlighting the groundbreaking nature of PHP 3.0.

*Verdict:* A nostalgic and inspiring read for PHP enthusiasts.

---

### **A Letter to My Past Self**

Chris Tankersley’s reflective letter to his younger self is deeply personal and universally relatable. Key messages like "It’s okay to make mistakes," "Learning never stops," and "Take care of your health" are reminders we all need from time to time. I saw myself in this article, and I suspect many others will, too.

*Verdict:* An emotional and motivational highlight of the issue.

---

### **Taming Magic Strings with PHP Enums**

Oscar Merida’s piece on PHP Enums is hands down better than its counterpart in other publications. The article clearly explains how Enums in PHP 8.1 can replace "magic values", improving code clarity, structure, and type safety.

#### **Example: Using Enums in PHP**
```php
enum UserRole: string {
    case Admin = 'admin';
    case Editor = 'editor';
    case Viewer = 'viewer';
}

function getPermissions(UserRole $role): array {
    return match($role) {
        UserRole::Admin => ['create', 'edit', 'delete'],
        UserRole::Editor => ['edit', 'create'],
        UserRole::Viewer => ['read'],
    };
}
```
This concise example demonstrates how Enums remove ambiguity and make code more maintainable.

*Verdict:* A standout article for developers eager to modernize their PHP codebases.

---

### **Exception Reporter Part 2**

Edward Barnard’s follow-up on exception handling focuses more on testing structures than on exceptions themselves. While the topic drifted slightly, I found value in the emphasis on testing practices like **Arrange, Act, Assert** and the underlying philosophy of Kent Beck’s "Make it work, make it right, make it fast."

*Verdict:* Interesting insights, but not as focused as it could be.

---

### **Congratulations, You’re an Organizer**

Scott Keck-Warren’s article is a passionate call to action for developers to engage in the PHP community by organizing or attending user groups and events. I completely agree with the sentiment: events, talks, and networking are some of the most rewarding aspects of our job. Whether as an organizer, speaker, or attendee, the experience strengthens the community and personal growth alike.

*Verdict:* A strong reminder of the value of community involvement. Highly recommended.

---

## **2024 EOL** and Conclusion

The December 2024 issue of *php[architect]* is a fitting close to a fantastic year for PHP. From foundational principles to modern tools and retrospectives, the magazine offers something for every developer. My thanks go out to the authors and the PHP community for their contributions and insights throughout the year. Here’s to an even more exciting 2025!

**Buy here: https://www.phparch.com/magazine/2024/12/2024-12-time-for-php/**