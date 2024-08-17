const PrescriptionNFT = artifacts.require("PrescriptionNFT");

contract("PrescriptionNFT", accounts => {
  let prescriptionNFT;
  const owner = accounts[0];
  const doctor = accounts[1];
  const patient = accounts[2];
  const pharmacy = accounts[3];

  beforeEach(async () => {
    prescriptionNFT = await PrescriptionNFT.new({ from: owner });
  });

  it("should approve a doctor", async () => {
    await prescriptionNFT.approveDoctor(doctor, "Dr. Smith", { from: owner });
    const approvedDoctor = await prescriptionNFT.approvedDoctors(doctor);
    assert.equal(approvedDoctor.name, "Dr. Smith");
    assert.equal(approvedDoctor.isValid, true);
  });

  it("should prescribe a medication", async () => {
    await prescriptionNFT.approveDoctor(doctor, "Dr. Smith", { from: owner });
    await prescriptionNFT.prescribe(
      patient,
      "12345678",
      "Aspirin",
      500,
      "mg",
      30,
      Math.floor(Date.now() / 1000) + 86400, // 1 day from now
      { from: doctor }
    );
    const balance = await prescriptionNFT.balanceOf(patient);
    assert.equal(balance, 1);
  });

  // Add more tests for other functions
});