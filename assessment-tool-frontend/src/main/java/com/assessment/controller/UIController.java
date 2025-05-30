/*
 * package com.assessment.controller;
 * 
 * import org.springframework.beans.factory.annotation.Autowired; import
 * org.springframework.stereotype.Controller; import
 * org.springframework.ui.Model; import
 * org.springframework.web.bind.annotation.GetMapping;
 * 
 * import com.assessment.service.BackendService;
 * 
 * @Controller public class UIController {
 * 
 * @Autowired private BackendService backendService;
 * 
 * @GetMapping("/") public String home(Model model) {
 * model.addAttribute("message", "Welcome to Assessment Tool Frontend!"); //
 * Also add backend data to home page model.addAttribute("backendMessage",
 * backendService.getDefaultTestMessage()); model.addAttribute("allMessages",
 * backendService.getAllTestMessages()); return "test"; }
 * 
 * @GetMapping("/test") public String test(Model model) {
 * model.addAttribute("message", "Welcome to Assessment Tool Frontend!");
 * model.addAttribute("backendMessage", backendService.getDefaultTestMessage());
 * model.addAttribute("allMessages", backendService.getAllTestMessages());
 * return "test"; } }
 */