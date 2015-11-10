define([
	"jquery"
	,"signals"
	,"../lang"
	,"../events"
], function ($, Signal, lang, events) {

	function showModal(id){
		$(".modal-dialog").hide();
		$("#modals").modal("show");
		$("#" + id).show();
	}

	function hideModal(){
		$("#modals").modal("hide");
	}

  $("#confirm-msg .accept").click(function() {
		confirmAction.dispatch(true);
	});
	$("#confirm-msg .decline").click(function() {
		confirmAction.dispatch(false);
	});
	events.inited.addOnce(function(){
		$('#modals').modal({backdrop:"static", show: false});
	});

	$('#modals').on('hidden.bs.modal', function (e) {
		self.hidden.dispatch();
	})

	var confirmAction = new Signal();

	var self = {};

	self.hidden = new Signal();

	self.showMessageModal = function(title, body, accept, decline, acceptCallback, declineCallback) {

		$("#confirm-msg .modal-title").text(title);
		$("#confirm-msg .modal-body").html(body);
		$("#confirm-msg .accept").text(accept);
		$("#confirm-msg .decline").text(decline);

		$("#confirm-msg .decline").toggle(decline !== null);

		var clearup = function() {
			confirmAction.removeAll();
			hideModal();
		}

		var acceptWrapper = function(){
			var ret = acceptCallback ? acceptCallback() : true;
			if (!(typeof ret === "boolean" && ret === false)) clearup();
		};

		var declineWrapper = function(){
			if (declineCallback) declineCallback();
			clearup();
		};

		confirmAction.add(function(accepted){
			accepted ? acceptWrapper() : declineWrapper();
		});

		showModal("confirm-msg");
	}

	self.showRenamePrompt = function(title, placeholder, acceptCallback) {
		self.showPromptModal(title, placeholder, lang.ui.get("OK_ACTION"), null, acceptCallback, null, 30);
	}

  self.showPromptModal = function(title, placeholder, accept, decline, acceptCallback, declineCallback, maxInputLength) {

		$("#confirm-msg .modal-title").text(title);
		$("#confirm-msg .accept").text(accept);
		$("#confirm-msg .decline").text(decline);
		$("#confirm-msg .decline").toggle(decline !== null);

		var input = $('<input>').attr({
			type: "text"
			,class: "form-control"
			,value: placeholder
		}).on("keydown", function (e){
      if(e.keyCode == 13){
				acceptWrapper();
      }
    });
		if (typeof maxInputLength == "number")
		{
			input.attr("maxlength", maxInputLength);
		}

		$("#confirm-msg .modal-body").empty().append(input);

		var close = function(){
			confirmAction.removeAll();
	    hideModal();
    }

		var acceptWrapper = function(){
			close();
			acceptCallback(input.val());
    }

		confirmAction.addOnce(function(accepted){
			if (accepted)
			{
				acceptWrapper();
			} else {
				close();
			}
		});

		showModal("confirm-msg");
	}


	return self;
});
