// (encapsulated design)
void approveChange(){
    if (this.Approved == true) {
        throw new Exception("Already approved");
    }
    this.Approved = true;
    this.Approver = CURRENT_USER;
    this.ApprovalTime = DateTime.Now;
}

// (pure design)
Approval approveChange(Approval a) {
    if (a.Approved == true) {
        throw new Exception("Already approved");
    }
    a.Approved = true;
    a.Approver = CURRENT_USER;
    a.ApprovalTime = DateTime.Now;
}

// (pure, type-safe design)
Approved approveChange(ToBeApproved c) {
    return new Approved() {
        Data = c.Data,
        Approver = CURRENT_USER,
        ApprovalTime = DateTime.Now
    };
}
