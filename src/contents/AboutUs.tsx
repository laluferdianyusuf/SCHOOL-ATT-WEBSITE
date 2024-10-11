import React, { ReactNode } from "react";
import { FaUniversity } from "react-icons/fa";
import { LuSchool } from "react-icons/lu";

interface Admin {
  id: number;
  name: string;
  role: string;
  avatarUrl?: string;
}

interface Teacher {
  id: number;
  name: string;
  subject: string;
  avatarUrl?: string;
}

interface Student {
  id: number;
  name: string;
  major: string;
  avatarUrl?: string;
}

interface School {
  id: number;
  name: string;
  logoUrl?: ReactNode;
  description: string;
}

interface TeamMemberProps {
  name: string;
  role: string;
  avatarUrl?: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, avatarUrl }) => {
  return (
    <div className="flex items-center space-x-4">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={`${name} Avatar`}
          className="w-16 h-16 rounded-full object-cover"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-gray-600 text-lg">
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <div>
        <h4 className="text-lg font-medium">{name}</h4>
        <p className="text-gray-600">{role}</p>
      </div>
    </div>
  );
};

export const AboutUs: React.FC = () => {
  const school: School = {
    id: 1,
    name: "School Attendances",
    logoUrl: <LuSchool size={80} color="#14B8A6" />,
    description:
      "The easiest way to manage your school, students and teachers information.",
  };

  const admin: Admin = {
    id: 1,
    name: "Tedes Tech",
    role: "Powered Administrator",
    avatarUrl: "https://via.placeholder.com/150",
  };

  const teachers: Teacher[] = [
    {
      id: 1,
      name: "Khalid",
      subject: "Founder of Tedes Tech",
      avatarUrl: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Rizkul",
      subject: "CEO of Tedes Tech",
      avatarUrl: "https://via.placeholder.com/150",
    },
  ];

  const students: Student[] = [
    {
      id: 1,
      name: "Lalu Ferdian Yusuf",
      major: "Software Dev",
      avatarUrl: "https://via.placeholder.com/150",
    },
  ];

  return (
    <div className="h-[97vh] 2xl:h-[98.2vh] overflow-auto no-scrollbar bg-white p-6 content-center">
      <section className="max-w-5xl mx-auto bg-white border-b-[2px] border-slate-200 p-6 mb-8">
        <div className="flex flex-col items-center text-center">
          {school.logoUrl ? (
            school.logoUrl
          ) : (
            <FaUniversity className="w-32 h-32 text-blue-500 mb-4" />
          )}
          <h1 className="text-3xl font-bold mb-2">{school.name}</h1>
          <p className="text-gray-600">{school.description}</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto bg-white rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Meet Our Team</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="space-y-4">
              {admin ? (
                <TeamMember
                  name={admin.name}
                  role={admin.role}
                  avatarUrl={admin.avatarUrl}
                />
              ) : (
                <p className="text-gray-600">No admin data available.</p>
              )}
            </div>
          </div>

          <div>
            <div className="space-y-4">
              {teachers.length > 0 ? (
                teachers.map((teach) => (
                  <TeamMember
                    key={teach.id}
                    name={teach.name}
                    role={teach.subject}
                    avatarUrl={teach.avatarUrl}
                  />
                ))
              ) : (
                <p className="text-gray-600">No teachers available.</p>
              )}
            </div>
          </div>

          <div>
            <div className="space-y-4">
              {students.length > 0 ? (
                students.map((stud) => (
                  <TeamMember
                    key={stud.id}
                    name={stud.name}
                    role={stud.major}
                    avatarUrl={stud.avatarUrl}
                  />
                ))
              ) : (
                <p className="text-gray-600">No students available.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
