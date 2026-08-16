export function generateTeam(run: number) {
  return {
    teamName: `AUTOTEST-${run}-${crypto.randomUUID().slice(0, 6)}`,
    members: [
      {
        name: "Test Student 1 (Leader)",
        pid: `AUTO${run}01`,
        email: `autotest.${run}.01@example.com`,
        phone: "9000000001",
        gender: "Female",
        branch: "INFT",
        year: "TE"
      },
      {
        name: "Test Student 2",
        pid: `AUTO${run}02`,
        email: `autotest.${run}.02@example.com`,
        phone: "9000000002",
        gender: "Male",
        branch: "CMPN",
        year: "TE"
      },
      {
        name: "Test Student 3",
        pid: `AUTO${run}03`,
        email: `autotest.${run}.03@example.com`,
        phone: "9000000003",
        gender: "Male",
        branch: "EXTC",
        year: "SE"
      },
      {
        name: "Test Student 4",
        pid: `AUTO${run}04`,
        email: `autotest.${run}.04@example.com`,
        phone: "9000000004",
        gender: "Female",
        branch: "ELEC",
        year: "SE"
      },
      {
        name: "Test Student 5",
        pid: `AUTO${run}05`,
        email: `autotest.${run}.05@example.com`,
        phone: "9000000005",
        gender: "Male",
        branch: "ECS",
        year: "BE"
      },
      {
        name: "Test Student 6",
        pid: `AUTO${run}06`,
        email: `autotest.${run}.06@example.com`,
        phone: "9000000006",
        gender: "Male",
        branch: "AIML",
        year: "FE"
      }
    ]
  };
}
