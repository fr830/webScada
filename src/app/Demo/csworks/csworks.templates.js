function fireRequest(templateName) {
    return $.ajax({
        url: "csworks/" + templateName + ".html",
        dataType: 'html',
        async: false, // This is very important. Without this, page DOM may be parsed before templates are loaded, which is totally bad
        success: function(templateBody) {
            console.log("Got template [" + templateName + "]");
            var script = $("<script>").attr("id", templateName).attr("type", 'text/html').html(templateBody);
            $("body").append(script);
        }
    });
}

function loadTemplates(templateNames) {
    startingpoint = $.Deferred();
    startingpoint.resolve();

    $.each(templateNames, function(ix, templateName) {
        startingpoint = startingpoint.pipe(function() {
            console.log("Making request for template [" + templateName + "]");
            return fireRequest(templateName);
        });
    });
};

// knockout code inspired by http://stackoverflow.com/questions/9233176/unique-ids-in-knockout-js-templates
ko.bindingHandlers.ctrlId = {
    init: function(element, valueAccessor) {
        // Set ctrl name
        ko.bindingHandlers.ctrlId.ctrlName = valueAccessor();
        // Increment ctrl id
        ++ko.bindingHandlers.ctrlId.counter;
    },
    prefix: "autoId_",
    ctrlName: "",
    counter: 0
};

ko.bindingHandlers.resId = {
    init: function(element, valueAccessor) {
        // Assign resource id
        element.id = ko.bindingHandlers.ctrlId.prefix + ko.bindingHandlers.ctrlId.ctrlName + valueAccessor() + ko.bindingHandlers.ctrlId.counter.toString();
        console.log("resId:" + element.id);
    }
};

ko.bindingHandlers.fillResId = {
    init: function(element, valueAccessor) {
        // Use recently generated element id in the style.fill value 
        var value = ko.bindingHandlers.ctrlId.prefix + ko.bindingHandlers.ctrlId.ctrlName + valueAccessor() + ko.bindingHandlers.ctrlId.counter.toString();
        element.style.fill = "url(#" + value + ")";
        console.log("fillResId:" + element.style.fill);
    }
};

ko.bindingHandlers.clipPathResId = {
    init: function(element, valueAccessor) {
        // Use recently generated element id in the style.fill value 
        var value = ko.bindingHandlers.ctrlId.prefix + ko.bindingHandlers.ctrlId.ctrlName + valueAccessor() + ko.bindingHandlers.ctrlId.counter.toString();
        element.style.clipPath = "url(#" + value + ")";
        console.log("clipPathResId:" + element.style.clipPath);
    }
};