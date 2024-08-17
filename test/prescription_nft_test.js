const PrescriptionNFT = artifacts.require("PrescriptionNFT");
const truffleAssert = require('truffle-assertions');

contract("PrescriptionNFT", accounts => {
  let prescriptionNFT;
  const owner = accounts[0];
  const doctor = accounts[1];
  const patient = accounts[2];
  const pharmacy = accounts[3];
  const unauthorizedUser = accounts[4];

  beforeEach(async () => {
    prescriptionNFT = await PrescriptionNFT.new({ from: owner });
  });

  describe("Doctor approval", () => {
    it("should approve a doctor", async () => {
      await prescriptionNFT.approveDoctor(doctor, "Dr. Smith", { from: owner });
      const approvedDoctor = await prescriptionNFT.approvedDoctors(doctor);
      assert.equal(approvedDoctor.name, "Dr. Smith");
      assert.equal(approvedDoctor.isValid, true);
    });

    it("should not allow non-owner to approve a doctor", async () => {
      await truffleAssert.reverts(
        prescriptionNFT.approveDoctor(doctor, "Dr. Smith", { from: unauthorizedUser }),
        "Only owner can call this function"
      );
    });
  });

  describe("Prescription creation", () => {
    beforeEach(async () => {
      await prescriptionNFT.approveDoctor(doctor, "Dr. Smith", { from: owner });
    });

    it("should prescribe a medication", async () => {
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
      assert.equal(balance.toNumber(), 1);
    });

    it("should not allow unapproved doctor to prescribe", async () => {
      await truffleAssert.reverts(
        prescriptionNFT.prescribe(
          patient,
          "12345678",
          "Aspirin",
          500,
          "mg",
          30,
          Math.floor(Date.now() / 1000) + 86400,
          { from: unauthorizedUser }
        ),
        "Doctor is not approved"
      );
    });
  });

  describe("Prescription cancellation", () => {
    let tokenId;

    beforeEach(async () => {
      await prescriptionNFT.approveDoctor(doctor, "Dr. Smith", { from: owner });
      const tx = await prescriptionNFT.prescribe(
        patient,
        "12345678",
        "Aspirin",
        500,
        "mg",
        30,
        Math.floor(Date.now() / 1000) + 86400,
        { from: doctor }
      );
      tokenId = tx.logs[0].args.tokenId.toNumber();
    });

    it("should allow doctor to cancel prescription", async () => {
      await prescriptionNFT.cancelPrescription(tokenId, { from: doctor });
      const balance = await prescriptionNFT.balanceOf(patient);
      assert.equal(balance.toNumber(), 0);
    });

    it("should not allow unauthorized cancellation", async () => {
      await truffleAssert.reverts(
        prescriptionNFT.cancelPrescription(tokenId, { from: unauthorizedUser }),
        "Doctor is not approved"
      );
    });
  });

  describe("Prescription filling", () => {
    let tokenId;

    beforeEach(async () => {
      await prescriptionNFT.approveDoctor(doctor, "Dr. Smith", { from: owner });
      const tx = await prescriptionNFT.prescribe(
        patient,
        "12345678",
        "Aspirin",
        500,
        "mg",
        30,
        Math.floor(Date.now() / 1000) + 86400,
        { from: doctor }
      );
      tokenId = tx.logs[0].args.tokenId.toNumber();
    });

    it("should allow patient to fill prescription", async () => {
      await prescriptionNFT.fillPrescription(pharmacy, tokenId, { from: patient });
      const newOwner = await prescriptionNFT.ownerOf(tokenId);
      assert.equal(newOwner, pharmacy);
    });

    it("should not allow unauthorized filling", async () => {
      await truffleAssert.reverts(
        prescriptionNFT.fillPrescription(pharmacy, tokenId, { from: unauthorizedUser }),
        "Not the prescribed user"
      );
    });
  });
});