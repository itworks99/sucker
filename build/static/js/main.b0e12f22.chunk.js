(this.webpackJsonpsucker=this.webpackJsonpsucker||[]).push([[0],{264:function(e,t,n){e.exports=n(442)},442:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),l=n(54),i=n.n(l),r=(n(269),n(225)),c=n(226),s=n(24),u=n(253),d=n(251),m=n(115),h=n.n(m),p=n(462),f=n(55),E=n(472),g=n(467),v=n(461),C=n(460),b=n(466),w=n(83),S=n(453),y=n(443),k=n(463),O=n(464),I=n(454),T=n(456),R=n(465),x=n(470),q=n(471),_=n(457),j=n(469),F=n(468),L=n(458),M=n(459),A=n(455),P=function(e){Object(u.a)(n,e);var t=Object(d.a)(n);function n(e){var a;return Object(r.a)(this,n),(a=t.call(this,e)).state={},a.callLoadConfigurationFile=function(){a.httpRequestMethod="OPTIONS",a.loadConfigurationFile()},a.importConfiguration=function(){var e=a.state.dataJSON;fetch("http://localhost:3000/import",{method:"POST",body:a.configurationToImport,headers:{"Access-Control-Allow-Origin":"http://localhost:3000","Access-Control-Allow-Methods":"GET, POST, OPTIONS, PUT, PATCH, DELETE","Access-Control-Allow-Headers":"X-Requested-With, Content-Type, Accept"}}).then(a.setState({isLoaded:!1})).then((function(e){return e.json()})).then((function(t){a.setState({importedDataJSON:t,importCompleted:!0});for(var n,o="",l=0,i=0;i<t.id.length;i++)e.is_enabled[i]=0;for(i=0;i<t.id.length;i++){var r=t.id[i];999===t.id[i]?o=o+" "+t.tags[i]+";":(e.is_enabled[r]=1,e.value[r]=t.value[i],e.switchable[r]=t.switchable[i],e.switch_position[r]=t.switch_position[i],l++)}""!==o&&(o=" The following entries were skipped as they are not being present in current version:"+o),n="Import completed: "+t.id.length+" entries processed, "+l+" recognized."+o,a.setState({openImportWindow:!1,statusMessage:n,isLoaded:!0})}))},a.closeConfigShow=function(e,t){return function(){a.setState({closeOnEscape:e,closeOnDimmerClick:t,open:!0})}},a.confirm=function(){return a.setState({confirm:!0})},a.confirmClose=function(){return a.setState({confirm:!1})},a.open=function(){return a.setState({open:!0})},a.close=function(){return a.setState({open:!1})},a.handleContextRef=function(e){return a.setState({contextRef:e})},a.handleOpen=function(){return a.setState({active:!0})},a.handleClose=function(){return a.setState({active:!1})},a.handleEditorClose=function(){return a.setState({openEditor:!1})},a.handleConfigPreview=function(){return a.setState({open:!0})},a.handleHideClick=function(){return a.setState({visible:!1})},a.resetComponent=function(){return a.setState({isLoading:!1,results:[],value:""})},a.handleClick=function(e,t){var n=t.index,o=a.state.activeIndex===n?-1:n;a.setState({activeIndex:o}),a.setState({helpEntryId:0})},a.handleHelpButtonClick=function(e){a.setState({helpEntryId:e.target.value}),a.setState({helpTextIsVisible:!0})},a.handleEntrySliderClick=function(e){var t=a.state.dataJSON;t.is_enabled[e.target.value]=!t.is_enabled[e.target.value]},a.handleVersionDropdownClick=function(e,t){var n=t.value;a.version=n,a.setState({openReloadConfirmation:!0})},a.readValueFromComponent=function(e,t){var n=t.entrynumber,o=t.value;a.state.dataJSON.value[n]=o},a.readConfigurationToImport=function(e){a.configurationToImport=e.target.value},a.handleMultilineEdit=function(e){a.state.dataJSON.value[a.multilineEntryId]=e.target.value},a.displayMultilineEditor=function(e,t){var n=t.value;a.multilineEntryId=n,a.setState((function(e){return{openEditor:!e.openEditor}}))},a.handleImportWindow=function(){a.setState({openImportWindow:!a.state.openImportWindow})},a.closeReloadConfirmationWindow=function(){return a.setState({openReloadConfirmation:!1})},a.focusOnComponent=function(e,t){var n=t.entrynumber;a.componentRef[n].current.focus()},a.focusTextInput=function(e,t){var n=t.result,o=a.state.dataJSON,l=n.record;a.setState((function(){return{activeIndex:o.section_number[l]}})),a.setState((function(){return{activeRowIndex:l}})),1!==o.switchable[l]&&a.componentRef[l].current.focus()},a.handleSearchChange=function(e,t){var n=t.value;function o(){var e=1;return e+1}var l=a.state.dataJSON,i=h.a.times(l.tags.length,(function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:o;return{title:a.state.dataJSON.tags[e],record:e}}));a.setState({isLoading:!0,value:n}),setTimeout((function(){if(a.state.value.length<1)return a.resetComponent();var e=new RegExp(h.a.escapeRegExp(a.state.value),"i");a.setState({isLoading:!1,results:h.a.filter(i,(function(t){return e.test(t.title)}))})}),300)},a.state={value:""},a.state={activeIndex:0},a.state={activeRowIndex:0},a.state={visible:!1},a.state={helpEntryId:0},a.state={confirm:!1},a.state={openEditor:!1},a.state={openImportWindow:!1},a.state={dataJSON:""},a.state={isLoaded:!1},a.state={configurationToImport:""},a.state={statusMessage:""},a.state={version:""},a.state={openReloadConfirmation:!1},a.state={httpRequestMethod:""},a.state={closeOnEscape:!1},a.state={closeOnDimmerClick:!1},a.componentRef=[],a.handleClick=a.handleClick.bind(Object(s.a)(a)),a.handleConfigPreview=a.handleConfigPreview.bind(Object(s.a)(a)),a.handleMultilineEdit=a.handleMultilineEdit.bind(Object(s.a)(a)),a.handleHelpButtonClick=a.handleHelpButtonClick.bind(Object(s.a)(a)),a.handleEntrySliderClick=a.handleEntrySliderClick.bind(Object(s.a)(a)),a.readValueFromComponent=a.readValueFromComponent.bind(Object(s.a)(a)),a.displayMultilineEditor=a.displayMultilineEditor.bind(Object(s.a)(a)),a.handleImportWindow=a.handleImportWindow.bind(Object(s.a)(a)),a.readConfigurationToImport=a.readConfigurationToImport.bind(Object(s.a)(a)),a.importConfiguration=a.importConfiguration.bind(Object(s.a)(a)),a.focusOnComponent=a.focusOnComponent.bind(Object(s.a)(a)),a.AccordeonIconColors={},a.loadConfigurationFile=a.loadConfigurationFile.bind(Object(s.a)(a)),a.callLoadConfigurationFile=a.callLoadConfigurationFile.bind(Object(s.a)(a)),a}return Object(c.a)(n,[{key:"componentDidMount",value:function(){this.httpRequestMethod="GET",this.loadConfigurationFile()}},{key:"loadConfigurationFile",value:function(){var e=this;this.setState({isLoaded:!1}),"GET"===this.httpRequestMethod?fetch("http://localhost:3000/json",{method:this.httpRequestMethod}).then((function(e){return e.json()})).then((function(t){e.setState({dataJSON:t,isLoaded:!0})}),(function(t){e.setState({isLoaded:!0,error:t})})):(fetch("http://localhost:3000/version",{method:this.httpRequestMethod,headers:{Accept:"application/json","Content-Type":"application/json","Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, POST, OPTIONS, PUT, PATCH, DELETE","Access-Control-Allow-Headers":"X-Requested-With, Content-Type, Accept, access-control-allow-headers"},body:JSON.stringify({version:this.version})}).then((function(e){return e.json()})).then((function(t){e.setState({dataJSON:t,isLoaded:!0})}),(function(t){e.setState({isLoaded:!0,error:t})})),this.setState({openReloadConfirmation:!1}))}},{key:"warningIconPopup",value:function(e,t){return o.a.createElement(p.a,{trigger:o.a.createElement(f.a,{color:e,name:"warning sign"}),content:t})}},{key:"render",value:function(){var e=this,t=this.state,n=t.activeIndex,a=t.activeRowIndex,l=t.active,i=t.openEditor,r=t.open,c=t.openImportWindow,s=t.closeOnEscape,u=t.dataJSON,d=t.isLoaded,m=t.error,h=t.contextRef,P=t.isLoading,N=t.value,W=t.results,J=t.statusMessage,H=t.openReloadConfirmation,B=this.handleClick,V=this.handleHelpButtonClick,z=this.handleEntrySliderClick,D=this.readValueFromComponent,G=this.displayMultilineEditor,U=this.warningIconPopup,K=this.componentRef,X=this.focusOnComponent,$=function(e){var t=e.title,n=e.record;return o.a.createElement(E.a,{key:n,size:"tiny",content:t,subheader:u.all_sections[u.section_number[n]].toLowerCase()})},Q=function(t,n,a,l){return o.a.createElement(v.a,{dimmer:"inverted",open:t,closeOnEscape:s,onClose:e.close},o.a.createElement(E.a,{icon:n,content:a}),o.a.createElement(v.a.Content,{scrolling:!0},o.a.createElement(C.a,null,l)))};return m?o.a.createElement("div",null,"Error: ",m.message):d?o.a.createElement(o.a.Fragment,null,o.a.createElement(j.a,null,o.a.createElement(F.a,{fixed:"top",inverted:!0,fitted:"vertically",color:"black"},o.a.createElement(T.a,null,o.a.createElement(F.a.Item,{as:"a",header:!0,onClick:this.handleOpen},o.a.createElement(E.a,{as:"h3",inverted:!0},o.a.createElement(f.a,{inverted:!0,name:"circle outline",color:"purple",size:"big"}),o.a.createElement(E.a.Content,null,"Sucker",o.a.createElement(E.a.Subheader,null,"Squid configuration editor")))),o.a.createElement(F.a.Item,{as:"a"},o.a.createElement(g.a,Object.assign({placeholder:"Search tags",minCharacters:3,loading:P,onResultSelect:e.focusTextInput,onSearchChange:e.handleSearchChange,resultRenderer:$,results:W,value:N},e.props))),o.a.createElement(F.a.Item,null,o.a.createElement(E.a,{as:"h5",inverted:!0},"Squid version"," ",o.a.createElement(k.a,{options:function(){for(var e=[],t=0;t<u.available_versions.length;t++)e.push({key:t,text:u.available_versions[t],value:u.available_versions[t]});return e}(),inline:!0,defaultValue:u.squid_version[0],onChange:this.handleVersionDropdownClick}))),o.a.createElement(F.a.Item,{as:"a",onClick:this.handleConfigPreview},o.a.createElement(E.a,{as:"h5",inverted:!0},o.a.createElement(f.a,{inverted:!0,name:"magic",size:"large"}),"Show")),o.a.createElement(F.a.Item,{as:"a",onClick:this.handleImportWindow},o.a.createElement(E.a,{as:"h5",inverted:!0},o.a.createElement(f.a,{inverted:!0,name:"download",size:"large"}),"Import"))))),o.a.createElement(L.a,null),o.a.createElement(x.a,{centered:!0,columns:3},o.a.createElement(x.a.Column,{widescreen:5,computer:2},o.a.createElement(b.a,null,o.a.createElement("p",null,"Loaded configuration for Squid ver."," ",o.a.createElement("b",null,u.squid_version[0])),o.a.createElement("p",null,o.a.createElement("b",null,u.tags.length)," unique tags in"," ",o.a.createElement("b",null,u.all_sections.length)," sections"),o.a.createElement("p",null,J))),o.a.createElement(x.a.Column,{widescreen:6,computer:7},o.a.createElement("div",{ref:this.handleContextRef},o.a.createElement(T.a,null,o.a.createElement(R.a,{styled:!0,fluid:!0},function(){for(var e=[],t=0,i=0,r=1e3,c="",s="",d="",m=[],h=0;h<u.all_sections.length;h++){var E=[],g=[];for(E[h]="";u.section_number[t]===h;){u.is_enabled[t]>0&&(m[h]="purple");var v="";if(E[h]+=u.tags[t]+"\n",K[t]=o.a.createRef(),u.switchable[t])if(1===u.switchable[t]){var b=[{key:"off",text:u.tags[t]+" off",value:u.tags[t]+" off"},{key:"on",text:u.tags[t]+" on",value:u.tags[t]+" on"}];v=o.a.createElement(k.a,{ref:K[t],entrynumber:i,fluid:!0,selection:!0,options:b,defaultValue:b[u.switch_position[t]].value,onChange:D})}else 2===u.switchable[t]&&(v=o.a.createElement(y.a,{ref:K[t],secondary:!0,compact:!0,value:t,onClick:G},u.tags[t]," - Click to edit"));else d=u.units[t]?o.a.createElement(w.a,{basic:!0,content:u.units[t],horizontal:!0}):"",v=o.a.createElement(C.a.Field,null,o.a.createElement(S.a,{fluid:!0,ref:K[t],entrynumber:i,defaultValue:u.value[t]+" ",onChange:D,labelPosition:"right",type:"text",action:!0},o.a.createElement("input",null),d,o.a.createElement(y.a,{basic:!0,type:"reset",entrynumber:i,onClick:X},"Reset")));c=u.message_built[t]?U("purple","Only available if Squid is compiled with the "+u.message_built[t]):"",s=u.message_warning[t]?U("pink",u.message_warning[t]):"";var q=!1;u.is_enabled[t]>0&&(q=!0),g[t]=o.a.createElement(O.a.Row,{key:"tableKey"+t,active:a===t},o.a.createElement(O.a.Cell,{width:1},o.a.createElement(I.a,{value:i,id:"checkboxEntry"+i++,defaultChecked:q,slider:!0,onClick:z})),o.a.createElement(O.a.Cell,null,o.a.createElement(C.a,null,v)),o.a.createElement(O.a.Cell,{width:2},c,s),o.a.createElement(O.a.Cell,{width:1,allign:"left"},o.a.createElement(y.a,{value:r++,compact:!0,basic:!0,color:"grey",active:l,onClick:V},"Help"))),t++}e[h]=o.a.createElement(T.a,{key:"containerKey"+h},o.a.createElement(R.a.Title,{active:n===h,index:h,onClick:B},o.a.createElement(p.a,{trigger:o.a.createElement(f.a,{name:"dropdown"}),size:"tiny",position:"left center",header:"Tags in this section:",content:o.a.createElement(x.a,{centered:!0,columns:1},o.a.createElement(x.a.Column,{textAlign:"left"},o.a.createElement("pre",null,E[h])))}),o.a.createElement(f.a,{name:"tags",color:m[h]}),"\xa0",u.all_sections[h]),o.a.createElement(R.a.Content,{active:n===h},o.a.createElement(O.a,{striped:!0,compact:!0,basic:"very"},o.a.createElement(O.a.Body,null,g))))}return e}())))),o.a.createElement(x.a.Column,{widescreen:5,computer:7},o.a.createElement(M.a,{context:h,offset:75},o.a.createElement(j.a,{basic:!0,size:"small"},o.a.createElement(E.a,{content:u.tags[this.state.helpEntryId-1e3]}),o.a.createElement("pre",null,u.help[this.state.helpEntryId-1e3]))))),Q(r,"copy","New configuration",o.a.createElement(o.a.Fragment,null,o.a.createElement(C.a.Field,null,o.a.createElement("p",null,o.a.createElement("b",null,"To use:")," copy configuration from the text area below and save it as squid.conf in the location of the original configuration file. By default, this file is located at"," ",o.a.createElement("b",null,"/etc/squid/squid.conf")," or"," ",o.a.createElement("b",null,"/usr/local/squid/etc/squid.conf"),"."),o.a.createElement(A.a,{autoHeight:!0,value:function(){for(var e="",t=0;t<u.section_number.length;t++)u.is_enabled[t]&&(e=e+"\n"+u.value[t]);return e}()})),o.a.createElement(y.a,{negative:!0,size:"large",onClick:this.close},"close"))),Q(i,"edit",u.tags[this.multilineEntryId],o.a.createElement(o.a.Fragment,null,o.a.createElement(C.a.Field,null,o.a.createElement(A.a,{autoHeight:!0,defaultValue:u.value[this.multilineEntryId],onChange:this.handleMultilineEdit})),o.a.createElement(y.a,{type:"reset",secondary:!0},"Revert to default"),o.a.createElement(y.a,{secondary:!0,onClick:this.displayMultilineEditor},"Save and close"))),Q(c,"paste","Import existing configuration",o.a.createElement(o.a.Fragment,null,o.a.createElement("p",null,o.a.createElement("b",null,"To import:")," copy and paste contents of ",o.a.createElement("b",null,"squid.conf")," ","into the window below. By default, this file is located at"," ",o.a.createElement("b",null,"/etc/squid/squid.conf")," or"," ",o.a.createElement("b",null,"/usr/local/squid/etc/squid.conf"),"."),o.a.createElement("p",null,o.a.createElement("b",null,"Please note:")," lines that begin with '#' (i.e. commented out) are not going to be processed."),o.a.createElement(C.a.TextArea,{control:"textarea",onChange:this.readConfigurationToImport}),o.a.createElement(y.a,{secondary:!0,onClick:this.handleImportWindow},"Close"),o.a.createElement(y.a,{secondary:!0,type:"submit",method:"post",onClick:this.importConfiguration},"Import"))),o.a.createElement(q.a,{inverted:!0,active:l,onClickOutside:this.handleClose,page:!0},o.a.createElement(E.a,{as:"h1",icon:!0,color:"purple"},o.a.createElement(f.a,{name:"circle outline",color:"purple"}),"Sucker",o.a.createElement(E.a.Subheader,null,"ver.0.2a")),o.a.createElement(E.a,{color:"grey"},o.a.createElement("p",null,"configuration editor for"," ",o.a.createElement("a",{href:"http://www.squid-cache.org/"},"Squid")," caching proxy"),o.a.createElement("p",null,o.a.createElement(f.a,{name:"github"}),"Github:"," ",o.a.createElement("a",{href:"https://github.com/itworks99/sucker"},"itworks99/sucker")),o.a.createElement("p",null,"Built with Bottle, Gunicorn, Python, React and Semantic-UI"),o.a.createElement("p",null,"Created in Sydney with ",o.a.createElement(f.a,{color:"pink",name:"heart"})))),Q(H,"question","Confirm reload of the Squid base configuration file",o.a.createElement(o.a.Fragment,null,o.a.createElement("p",null,"This action will reload base configuration file with the version requested. Plese note that any unsaved changes are going to be lost. Do you want to proceed?"),o.a.createElement(y.a,{negative:!0,onClick:this.closeReloadConfirmationWindow},"no"),o.a.createElement(y.a,{positive:!0,onClick:this.callLoadConfigurationFile},"yes")))):o.a.createElement(o.a.Fragment,null,o.a.createElement(q.a,{inverted:!0,active:!d},o.a.createElement(_.a,{inverted:!0,size:"massive"},"Loading")))}}]),n}(o.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(o.a.createElement(P,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[264,1,2]]]);
//# sourceMappingURL=main.b0e12f22.chunk.js.map