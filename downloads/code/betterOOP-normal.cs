public class User {
    private string name;
    private int id;
    private boolean isCustomer;
    private DateTime conversionDate = null;

    public User(int id, string name) {
        this.name = name;
        this.id = id;
        this.isCustomer = false;
    }

    public string MakeDropDownHtml() {
        if(isCustomer) {
            return String.Format("<option id="{0}">*{1}*</option>", id, name);
        }
        return String.Format("<option id="{0}">{1}</option>", id, name);
    }

    public void ConvertToCustomer() {
        this.isCustomer = true;
        this.conversionDate = DateTime.Now;
        new Notifier().Broadcast("CustomerConverted", this.Id);
    }
}
