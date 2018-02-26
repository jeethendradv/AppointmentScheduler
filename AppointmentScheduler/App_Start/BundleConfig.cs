using System.Web;
using System.Web.Optimization;

namespace AppointmentScheduler
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js",
                        "~/Scripts/jquery-ui-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/jqxwidget").Include(
                        "~/Scripts/jqwidgets/jqxcore.js",
                        "~/Scripts/jqwidgets/jqxbuttons.js",
                        "~/Scripts/jqwidgets/jqxscrollbar.js",
                        "~/Scripts/jqwidgets/jqxdata.js",
                        "~/Scripts/jqwidgets/jqxdate.js",
                        "~/Scripts/jqwidgets/jqxscheduler.js",
                        "~/Scripts/jqwidgets/jqxscheduler.api.js",
                        "~/Scripts/jqwidgets/jqxdatetimeinput.js",
                        "~/Scripts/jqwidgets/jqxmenu.js",
                        "~/Scripts/jqwidgets/jqxcalendar.js",
                        "~/Scripts/jqwidgets/jqxtooltip.js",
                        "~/Scripts/jqwidgets/jqxwindow.js",
                        "~/Scripts/jqwidgets/jqxcheckbox.js",
                        "~/Scripts/jqwidgets/jqxlistbox.js",
                        "~/Scripts/jqwidgets/jqxdropdownlist.js",
                        "~/Scripts/jqwidgets/jqxnumberinput.js",
                        "~/Scripts/jqwidgets/jqxradiobutton.js",
                        "~/Scripts/jqwidgets/jqxinput.js",
                        "~/Scripts/jqwidgets/globalization/globalize.js",
                        "~/Scripts/jqwidgets/globalization/globalize.culture.de-DE.js"));

            bundles.Add(new ScriptBundle("~/bundles/application").Include(
                        "~/Scripts/application.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/themes/base/jquery-ui.css",
                      "~/Content/site.css",
                      "~/Content/jqwidgets/jqx.base.css",
                      "~/Content/jqwidgets/jqx.darkblue.css"));
        }
    }
}
